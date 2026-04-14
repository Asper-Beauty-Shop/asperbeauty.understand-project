import { z } from "zod";

// ============================================================
// SHARED VALIDATION SCHEMAS
// ============================================================

/**
 * Sanitizes a string by removing potentially dangerous characters
 * while preserving Arabic and English text
 */
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/<[^>]*>/g, "") // Remove HTML tags
    .replace(/[<>'"`;]/g, "") // Remove dangerous characters
    .slice(0, 1000); // Limit length
}

// ============================================================
// CONTACT FORM SCHEMA
// ============================================================
export const contactFormSchema = z.object({
  name: z.string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters")
    .regex(/^[a-zA-Z\u0600-\u06FF\s'-]+$/, "Name contains invalid characters"),
  email: z.string()
    .trim()
    .email("Invalid email address")
    .max(255, "Email must be less than 255 characters"),
  message: z.string()
    .trim()
    .min(10, "Message must be at least 10 characters")
    .max(1000, "Message must be less than 1000 characters"),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

// ============================================================
// SEARCH INPUT SCHEMA
// ============================================================
export const searchInputSchema = z.string()
  .trim()
  .max(100, "Search query too long")
  .transform((val) => sanitizeInput(val));

// ============================================================
// CHECKOUT FORM SCHEMA (for reference, already in use)
// ============================================================
export const checkoutFormSchema = z.object({
  customerName: z.string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name too long")
    .regex(/^[a-zA-Z\u0600-\u06FF\s'-]+$/, "Name contains invalid characters"),
  customerPhone: z.string()
    .trim()
    .regex(/^07[789]\d{7}$/, "Invalid phone number format (07XXXXXXXX)"),
  customerEmail: z.string()
    .email("Invalid email")
    .max(255)
    .optional()
    .or(z.literal("")),
  deliveryAddress: z.string()
    .trim()
    .min(10, "Address must be at least 10 characters")
    .max(500, "Address too long"),
  city: z.string().min(1, "Please select a city"),
  notes: z.string()
    .trim()
    .max(500, "Notes too long")
    .optional()
    .or(z.literal("")),
});

export type CheckoutFormData = z.infer<typeof checkoutFormSchema>;

// ============================================================
// NEWSLETTER SCHEMA
// ============================================================
export const newsletterSchema = z.object({
  email: z.string()
    .trim()
    .email("Invalid email address")
    .max(255, "Email must be less than 255 characters"),
});

export type NewsletterData = z.infer<typeof newsletterSchema>;

// ============================================================
// ORDER TRACKING SCHEMA
// ============================================================
export const orderTrackingSchema = z.object({
  orderNumber: z.string()
    .trim()
    .min(1, "Order number is required")
    .max(50, "Order number too long")
    .regex(/^[A-Za-z0-9-]+$/, "Invalid order number format"),
  token: z.string()
    .trim()
    .optional(),
});

export type OrderTrackingData = z.infer<typeof orderTrackingSchema>;
