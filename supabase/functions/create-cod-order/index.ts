import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// ============================================================
// RATE LIMITING - In-memory store (per instance)
// ============================================================
interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

// Rate limit config: 5 orders per 15 minutes per IP
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

function getClientIP(req: Request): string {
  // Try various headers for IP detection
  const xForwardedFor = req.headers.get("x-forwarded-for");
  if (xForwardedFor) {
    return xForwardedFor.split(",")[0].trim();
  }
  const xRealIP = req.headers.get("x-real-ip");
  if (xRealIP) {
    return xRealIP.trim();
  }
  const cfConnectingIP = req.headers.get("cf-connecting-ip");
  if (cfConnectingIP) {
    return cfConnectingIP.trim();
  }
  return "unknown";
}

function checkRateLimit(
  clientIP: string,
): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const key = `order:${clientIP}`;

  // Clean up expired entries periodically
  if (Math.random() < 0.1) {
    for (const [k, v] of rateLimitStore.entries()) {
      if (v.resetAt < now) {
        rateLimitStore.delete(k);
      }
    }
  }

  const entry = rateLimitStore.get(key);

  if (!entry || entry.resetAt < now) {
    // Create new entry
    rateLimitStore.set(key, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS,
    });
    return {
      allowed: true,
      remaining: RATE_LIMIT_MAX - 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS,
    };
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt };
  }

  entry.count++;
  return {
    allowed: true,
    remaining: RATE_LIMIT_MAX - entry.count,
    resetAt: entry.resetAt,
  };
}

// ============================================================
// VALIDATION SCHEMAS
// ============================================================
const orderItemSchema = z.object({
  productId: z.string().min(1).max(100),
  productTitle: z.string().min(1).max(200),
  variantId: z.string().min(1).max(100),
  variantTitle: z.string().max(100).optional(),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid price format"),
  currency: z.string().length(3),
  quantity: z.number().int().positive().max(99),
  // Accept both array format [{name, value}] and object format {name: value}
  selectedOptions: z.union([
    z.array(z.object({ name: z.string(), value: z.string() })),
    z.record(z.string()),
  ]).optional(),
  imageUrl: z.string().url().nullable().optional(),
});

const orderSchema = z.object({
  customerName: z.string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name too long")
    .regex(/^[a-zA-Z\u0600-\u06FF\s'-]+$/, "Name contains invalid characters"),
  customerPhone: z.string()
    .trim()
    .regex(/^07[789]\d{7}$/, "Invalid Jordanian phone number format"),
  customerEmail: z.string()
    .email("Invalid email")
    .max(255)
    .optional()
    .or(z.literal("")),
  deliveryAddress: z.string()
    .trim()
    .min(10, "Address must be at least 10 characters")
    .max(500, "Address too long"),
  city: z.enum([
    "Amman",
    "Zarqa",
    "Irbid",
    "Aqaba",
    "Salt",
    "Mafraq",
    "Jerash",
    "Madaba",
    "Karak",
    "Ajloun",
    "Ma'an",
    "Tafilah",
  ], { errorMap: () => ({ message: "Invalid city" }) }),
  notes: z.string()
    .trim()
    .max(500, "Notes too long")
    .optional()
    .or(z.literal("")),
  items: z.array(orderItemSchema)
    .min(1, "Cart cannot be empty")
    .max(50, "Too many items"),
  subtotal: z.number().positive().max(10000),
  shippingCost: z.number().min(0).max(100),
  total: z.number().positive().max(10100),
  captchaToken: z.string().min(1, "CAPTCHA verification required"),
});

interface OrderItem {
  productTitle: string;
  variantTitle?: string;
  price: string;
  quantity: number;
  imageUrl?: string | null;
}

// ============================================================
// CAPTCHA VERIFICATION
// ============================================================
async function verifyHCaptcha(token: string): Promise<boolean> {
  const secretKey = Deno.env.get("HCAPTCHA_SECRET_KEY");

  if (!secretKey) {
    console.error("HCAPTCHA_SECRET_KEY not configured");
    return false;
  }

  try {
    const response = await fetch("https://hcaptcha.com/siteverify", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `response=${encodeURIComponent(token)}&secret=${
        encodeURIComponent(secretKey)
      }`,
    });

    const result = await response.json();
    console.log("hCaptcha verification result:", result.success);
    return result.success === true;
  } catch (error) {
    console.error("hCaptcha verification error:", error);
    return false;
  }
}

// ============================================================
// EMAIL GENERATION - Enhanced Luxury Template
// ============================================================
function generateOrderEmailHtml(
  customerName: string,
  orderNumber: string,
  confirmationToken: string,
  items: OrderItem[],
  subtotal: number,
  shippingCost: number,
  total: number,
  deliveryAddress: string,
  city: string,
  customerPhone: string,
  trackingUrl: string,
): string {
  // Generate items HTML with product images
  const itemsHtml = items.map((item) => `
    <tr>
      <td style="padding: 16px 12px; border-bottom: 1px solid #f0ebe5; vertical-align: top;">
        <table role="presentation" style="width: 100%;">
          <tr>
            ${
    item.imageUrl
      ? `
              <td style="width: 60px; vertical-align: top;">
                <img src="${escapeHtml(item.imageUrl)}" alt="${
        escapeHtml(item.productTitle)
      }" 
                  style="width: 55px; height: 55px; object-fit: cover; border-radius: 8px; border: 1px solid #e8e0d8;" />
              </td>
            `
      : ""
  }
            <td style="padding-left: ${
    item.imageUrl ? "12px" : "0"
  }; vertical-align: top;">
              <p style="margin: 0 0 4px; color: #333; font-size: 14px; font-weight: 600;">${
    escapeHtml(item.productTitle)
  }</p>
              ${
    item.variantTitle
      ? `<p style="margin: 0 0 4px; color: #888; font-size: 12px;">${
        escapeHtml(item.variantTitle)
      }</p>`
      : ""
  }
              <p style="margin: 0; color: #666; font-size: 13px;">Qty: ${item.quantity}</p>
            </td>
            <td style="text-align: right; vertical-align: top; width: 100px;">
              <p style="margin: 0; color: #4A0E19; font-size: 14px; font-weight: 600;">${
    (parseFloat(item.price) * item.quantity).toFixed(2)
  } JOD</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `).join("");

  return `
<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Order Confirmation - Asper Beauty</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8f5f2; -webkit-font-smoothing: antialiased;">
  <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f8f5f2;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 16px; box-shadow: 0 8px 30px rgba(74, 14, 25, 0.08); overflow: hidden;">
          
          <!-- Premium Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #4A0E19 0%, #6b1525 50%, #4A0E19 100%); padding: 40px 30px; text-align: center;">
              <table role="presentation" style="width: 100%;">
                <tr>
                  <td align="center">
                    <div style="width: 60px; height: 2px; background: linear-gradient(90deg, transparent, #D4AF37, transparent); margin-bottom: 20px;"></div>
                    <h1 style="margin: 0; color: #D4AF37; font-size: 32px; font-weight: 700; letter-spacing: 4px; font-family: Georgia, 'Times New Roman', serif;">ASPER BEAUTY</h1>
                    <p style="margin: 12px 0 0; color: #F3E5DC; font-size: 12px; letter-spacing: 2px; text-transform: uppercase;">Your Luxury Beauty Destination in Jordan</p>
                    <div style="width: 60px; height: 2px; background: linear-gradient(90deg, transparent, #D4AF37, transparent); margin-top: 20px;"></div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Success Message -->
          <tr>
            <td style="padding: 50px 40px 35px; text-align: center; background: linear-gradient(180deg, #fefefe 0%, #f8f5f2 100%);">
              <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%); border-radius: 50%; margin: 0 auto 20px; display: inline-block; line-height: 80px; box-shadow: 0 4px 15px rgba(40, 167, 69, 0.2);">
                <span style="color: #28a745; font-size: 42px; font-weight: bold;">✓</span>
              </div>
              <h2 style="margin: 0 0 10px; color: #4A0E19; font-size: 28px; font-weight: 600; font-family: Georgia, serif;">Order Confirmed!</h2>
              <p style="margin: 0; color: #666; font-size: 16px;">Thank you for your order, <strong style="color: #4A0E19;">${
    escapeHtml(customerName)
  }</strong></p>
            </td>
          </tr>
          
          <!-- Order Number Card -->
          <tr>
            <td style="padding: 0 40px 35px;">
              <table role="presentation" style="width: 100%; background: linear-gradient(135deg, #f8f5f2 0%, #f0ebe5 100%); border-radius: 12px; border: 1px solid #e8e0d8;">
                <tr>
                  <td style="padding: 25px; text-align: center;">
                    <p style="margin: 0 0 8px; color: #888; font-size: 11px; text-transform: uppercase; letter-spacing: 2px;">Order Number</p>
                    <p style="margin: 0; color: #4A0E19; font-size: 26px; font-weight: 700; letter-spacing: 1px; font-family: Georgia, serif;">${
    escapeHtml(orderNumber)
  }</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Order Items Section -->
          <tr>
            <td style="padding: 0 40px 30px;">
              <table role="presentation" style="width: 100%;">
                <tr>
                  <td>
                    <h3 style="margin: 0 0 5px; color: #4A0E19; font-size: 16px; font-weight: 600; font-family: Georgia, serif;">Order Details</h3>
                    <div style="width: 40px; height: 2px; background: #D4AF37; margin-bottom: 20px;"></div>
                  </td>
                </tr>
              </table>
              
              <table role="presentation" style="width: 100%; background-color: #fefefe; border-radius: 10px; border: 1px solid #f0ebe5;">
                ${itemsHtml}
              </table>
              
              <!-- Totals -->
              <table role="presentation" style="width: 100%; margin-top: 20px;">
                <tr>
                  <td style="padding: 8px 0; color: #666; font-size: 14px;">Subtotal</td>
                  <td style="padding: 8px 0; text-align: right; color: #333; font-size: 14px;">${
    subtotal.toFixed(2)
  } JOD</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666; font-size: 14px;">Shipping</td>
                  <td style="padding: 8px 0; text-align: right; font-size: 14px; ${
    shippingCost === 0 ? "color: #28a745; font-weight: 600;" : "color: #333;"
  }">${shippingCost === 0 ? "✨ FREE" : shippingCost.toFixed(2) + " JOD"}</td>
                </tr>
                <tr>
                  <td colspan="2" style="padding: 15px 0 0;">
                    <div style="height: 2px; background: linear-gradient(90deg, #D4AF37, #e8c547, #D4AF37);"></div>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 15px 0 0; color: #4A0E19; font-size: 20px; font-weight: 700; font-family: Georgia, serif;">Total</td>
                  <td style="padding: 15px 0 0; text-align: right; color: #4A0E19; font-size: 20px; font-weight: 700; font-family: Georgia, serif;">${
    total.toFixed(2)
  } JOD</td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Delivery Information -->
          <tr>
            <td style="padding: 0 40px 30px;">
              <table role="presentation" style="width: 100%;">
                <tr>
                  <td>
                    <h3 style="margin: 0 0 5px; color: #4A0E19; font-size: 16px; font-weight: 600; font-family: Georgia, serif;">Delivery Information</h3>
                    <div style="width: 40px; height: 2px; background: #D4AF37; margin-bottom: 20px;"></div>
                  </td>
                </tr>
              </table>
              
              <table role="presentation" style="width: 100%; background-color: #fefefe; border-radius: 10px; border: 1px solid #f0ebe5; padding: 20px;">
                <tr>
                  <td style="padding: 10px 20px; color: #888; font-size: 13px; width: 100px;">Name</td>
                  <td style="padding: 10px 20px; color: #333; font-size: 14px; font-weight: 500;">${
    escapeHtml(customerName)
  }</td>
                </tr>
                <tr>
                  <td style="padding: 10px 20px; color: #888; font-size: 13px;">Phone</td>
                  <td style="padding: 10px 20px; color: #333; font-size: 14px;">${
    escapeHtml(customerPhone)
  }</td>
                </tr>
                <tr>
                  <td style="padding: 10px 20px; color: #888; font-size: 13px;">City</td>
                  <td style="padding: 10px 20px; color: #333; font-size: 14px;">${
    escapeHtml(city)
  }</td>
                </tr>
                <tr>
                  <td style="padding: 10px 20px; color: #888; font-size: 13px; vertical-align: top;">Address</td>
                  <td style="padding: 10px 20px; color: #333; font-size: 14px; line-height: 1.5;">${
    escapeHtml(deliveryAddress)
  }</td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Payment Method Badge -->
          <tr>
            <td style="padding: 0 40px 30px;">
              <table role="presentation" style="width: 100%; background: linear-gradient(135deg, #fff8e1 0%, #fff3cd 100%); border: 2px solid #D4AF37; border-radius: 12px;">
                <tr>
                  <td style="padding: 22px; text-align: center;">
                    <p style="margin: 0 0 6px; color: #4A0E19; font-size: 18px; font-weight: 700;">💵 Cash on Delivery</p>
                    <p style="margin: 0; color: #8B7355; font-size: 14px;">Please have <strong style="color: #4A0E19;">${
    total.toFixed(2)
  } JOD</strong> ready upon delivery</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Track Order CTA -->
          <tr>
            <td style="padding: 0 40px 35px; text-align: center;">
              <a href="${trackingUrl}" style="display: inline-block; background: linear-gradient(135deg, #4A0E19 0%, #6b1525 100%); color: #D4AF37; text-decoration: none; padding: 16px 40px; border-radius: 10px; font-weight: 600; font-size: 16px; letter-spacing: 0.5px; box-shadow: 0 4px 15px rgba(74, 14, 25, 0.25);">
                📦 Track Your Order
              </a>
            </td>
          </tr>

          <!-- Token Section -->
          <tr>
            <td style="padding: 0 40px 30px;">
              <table role="presentation" style="width: 100%; background: linear-gradient(135deg, #f0f8ff 0%, #e6f2ff 100%); border: 1px solid #bee3f8; border-radius: 10px;">
                <tr>
                  <td style="padding: 18px; text-align: center;">
                    <p style="margin: 0 0 8px; color: #666; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">Confirmation Token (for tracking)</p>
                    <p style="margin: 0; color: #2c5282; font-size: 10px; font-family: 'Courier New', monospace; word-break: break-all; background: rgba(255,255,255,0.6); padding: 8px; border-radius: 6px;">${
    escapeHtml(confirmationToken)
  }</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- What's Next -->
          <tr>
            <td style="padding: 0 40px 35px;">
              <table role="presentation" style="width: 100%; background: linear-gradient(135deg, #f8f5f2 0%, #f0ebe5 100%); border-radius: 12px; padding: 25px;">
                <tr>
                  <td style="padding: 25px;">
                    <h4 style="margin: 0 0 18px; color: #4A0E19; font-size: 16px; font-weight: 600; font-family: Georgia, serif;">What's Next?</h4>
                    <table role="presentation" style="width: 100%;">
                      <tr>
                        <td style="padding: 8px 0; vertical-align: top; width: 30px;">
                          <span style="display: inline-block; width: 24px; height: 24px; background: #D4AF37; color: #4A0E19; border-radius: 50%; text-align: center; line-height: 24px; font-size: 12px; font-weight: 700;">1</span>
                        </td>
                        <td style="padding: 8px 0 8px 12px; color: #555; font-size: 14px; line-height: 1.5;">We'll call you to confirm your order</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; vertical-align: top;">
                          <span style="display: inline-block; width: 24px; height: 24px; background: #D4AF37; color: #4A0E19; border-radius: 50%; text-align: center; line-height: 24px; font-size: 12px; font-weight: 700;">2</span>
                        </td>
                        <td style="padding: 8px 0 8px 12px; color: #555; font-size: 14px; line-height: 1.5;">Your order will be prepared and shipped</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; vertical-align: top;">
                          <span style="display: inline-block; width: 24px; height: 24px; background: #D4AF37; color: #4A0E19; border-radius: 50%; text-align: center; line-height: 24px; font-size: 12px; font-weight: 700;">3</span>
                        </td>
                        <td style="padding: 8px 0 8px 12px; color: #555; font-size: 14px; line-height: 1.5;">Pay cash when your order arrives</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Premium Footer -->
          <tr>
            <td style="background: linear-gradient(135deg, #4A0E19 0%, #3a0b14 100%); padding: 35px 40px; text-align: center;">
              <p style="margin: 0 0 12px; color: #D4AF37; font-size: 14px; font-weight: 500;">Need help? We're here for you</p>
              <p style="margin: 0 0 20px; color: #F3E5DC; font-size: 13px;">📞 +962 79 065 6666 &nbsp;|&nbsp; 📧 asperpharma@gmail.com</p>
              <div style="width: 80px; height: 1px; background: linear-gradient(90deg, transparent, #D4AF37, transparent); margin: 0 auto 20px;"></div>
              <p style="margin: 0 0 8px; color: #D4AF37; font-size: 11px; letter-spacing: 1px;">100% AUTHENTIC PRODUCTS • JFDA AUTHORIZED RETAILER</p>
              <p style="margin: 0; color: #888; font-size: 11px;">© 2025 Asper Beauty. All rights reserved.</p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

// Escape HTML to prevent XSS in emails
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

// ============================================================
// EMAIL SENDING
// ============================================================
async function sendOrderConfirmationEmail(
  customerEmail: string,
  customerName: string,
  orderNumber: string,
  confirmationToken: string,
  items: OrderItem[],
  subtotal: number,
  shippingCost: number,
  total: number,
  deliveryAddress: string,
  city: string,
  customerPhone: string,
  siteUrl: string,
): Promise<boolean> {
  const resendApiKey = Deno.env.get("RESEND_API_KEY");

  if (!resendApiKey) {
    console.warn("RESEND_API_KEY not configured - skipping email");
    return false;
  }

  if (!customerEmail) {
    console.log("No customer email provided - skipping confirmation email");
    return false;
  }

  try {
    const resend = new Resend(resendApiKey);

    // Generate tracking URL
    const trackingUrl = `${siteUrl}/track-order?order=${
      encodeURIComponent(orderNumber)
    }&token=${encodeURIComponent(confirmationToken)}`;

    const emailHtml = generateOrderEmailHtml(
      customerName,
      orderNumber,
      confirmationToken,
      items,
      subtotal,
      shippingCost,
      total,
      deliveryAddress,
      city,
      customerPhone,
      trackingUrl,
    );

    const { data, error } = await resend.emails.send({
      from: "Asper Beauty <onboarding@resend.dev>", // Use your verified domain in production
      to: [customerEmail],
      subject: `Order Confirmed - ${orderNumber} | Asper Beauty`,
      html: emailHtml,
    });

    if (error) {
      console.error("Failed to send confirmation email:", error);
      return false;
    }

    console.log("Confirmation email sent successfully:", data?.id);
    return true;
  } catch (error) {
    console.error("Email sending error:", error);
    return false;
  }
}

// ============================================================
// MAIN HANDLER
// ============================================================
serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // ========== RATE LIMITING ==========
    const clientIP = getClientIP(req);
    const rateLimit = checkRateLimit(clientIP);

    console.log(
      `Rate limit check for ${clientIP}: allowed=${rateLimit.allowed}, remaining=${rateLimit.remaining}`,
    );

    if (!rateLimit.allowed) {
      const retryAfterSeconds = Math.ceil(
        (rateLimit.resetAt - Date.now()) / 1000,
      );
      console.warn(`Rate limit exceeded for ${clientIP}`);
      return new Response(
        JSON.stringify({
          error: "Too many orders. Please try again later.",
          retryAfter: retryAfterSeconds,
        }),
        {
          status: 429,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
            "Retry-After": String(retryAfterSeconds),
            "X-RateLimit-Limit": String(RATE_LIMIT_MAX),
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": String(Math.ceil(rateLimit.resetAt / 1000)),
          },
        },
      );
    }

    const body = await req.json();

    // ========== VALIDATION ==========
    const validationResult = orderSchema.safeParse(body);
    if (!validationResult.success) {
      const errors = validationResult.error.issues.map((i) => i.message).join(
        ", ",
      );
      console.warn("Validation failed:", errors);
      return new Response(
        JSON.stringify({ error: `Validation failed: ${errors}` }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
            "X-RateLimit-Remaining": String(rateLimit.remaining),
          },
        },
      );
    }

    const data = validationResult.data;

    // ========== CAPTCHA VERIFICATION ==========
    const captchaValid = await verifyHCaptcha(data.captchaToken);
    if (!captchaValid) {
      console.warn("CAPTCHA verification failed");
      return new Response(
        JSON.stringify({
          error: "CAPTCHA verification failed. Please try again.",
        }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
            "X-RateLimit-Remaining": String(rateLimit.remaining),
          },
        },
      );
    }

    // ========== CREATE ORDER ==========
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Sanitize order items for storage
    const sanitizedItems = data.items.map((item) => ({
      productId: item.productId.slice(0, 100),
      productTitle: item.productTitle.slice(0, 200),
      variantId: item.variantId.slice(0, 100),
      variantTitle: item.variantTitle?.slice(0, 100),
      price: item.price,
      currency: item.currency,
      quantity: item.quantity,
      selectedOptions: item.selectedOptions,
      imageUrl: item.imageUrl,
    }));

    // Generate temp order number (trigger will replace with proper one)
    const tempOrderNumber = "ASP-" + Date.now().toString().slice(-8);

    // Insert order using service role (bypasses RLS)
    const { data: order, error } = await supabase
      .from("cod_orders")
      .insert({
        order_number: tempOrderNumber,
        customer_name: data.customerName,
        customer_phone: data.customerPhone,
        customer_email: data.customerEmail || null,
        delivery_address: data.deliveryAddress,
        city: data.city,
        notes: data.notes || null,
        items: sanitizedItems,
        subtotal: data.subtotal,
        shipping_cost: data.shippingCost,
        total: data.total,
      })
      .select("order_number, confirmation_token")
      .single();

    if (error) {
      console.error("Database error:", error);
      return new Response(
        JSON.stringify({ error: "Failed to create order" }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
            "X-RateLimit-Remaining": String(rateLimit.remaining),
          },
        },
      );
    }

    console.log("Order created successfully:", order.order_number);

    // ========== SEND CONFIRMATION EMAIL ==========
    const siteUrl =
      Deno.env.get("SITE_URL") ??
      "https://https-www-asperbeautyshop-com.lovable.app";

    if (data.customerEmail) {
      await sendOrderConfirmationEmail(
        data.customerEmail,
        data.customerName,
        order.order_number,
        order.confirmation_token,
        sanitizedItems,
        data.subtotal,
        data.shippingCost,
        data.total,
        data.deliveryAddress,
        data.city,
        data.customerPhone,
        siteUrl,
      );
    }

    // Return success with rate limit headers
    return new Response(
      JSON.stringify({
        success: true,
        orderNumber: order.order_number,
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
          "X-RateLimit-Limit": String(RATE_LIMIT_MAX),
          "X-RateLimit-Remaining": String(rateLimit.remaining),
          "X-RateLimit-Reset": String(Math.ceil(rateLimit.resetAt / 1000)),
        },
      },
    );
  } catch (error) {
    console.error("Server error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
