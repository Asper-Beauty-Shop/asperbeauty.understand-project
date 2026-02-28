import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Validate authorization header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      console.error("Missing or invalid authorization header");
      return new Response(
        JSON.stringify({ error: "Unauthorized - missing token" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Create client with user's auth context
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    // Verify the user's JWT and get user data
    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await userClient.auth.getUser(
      token,
    );

    if (userError || !userData?.user) {
      console.error("Invalid token:", userError?.message);
      return new Response(
        JSON.stringify({ error: "Unauthorized - invalid token" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const user = userData.user;
    const userId = user.id;
    const userEmail = user.email;

    console.log(
      `GDPR Deletion Request: User ${userId} (${userEmail}) requested account deletion at ${
        new Date().toISOString()
      }`,
    );

    // Parse request body for confirmation
    const body = await req.json().catch(() => ({}));
    const { confirmEmail } = body;

    // Require email confirmation as additional verification
    if (
      !confirmEmail || confirmEmail.toLowerCase() !== userEmail?.toLowerCase()
    ) {
      console.warn(`Deletion rejected: Email mismatch for user ${userId}`);
      return new Response(
        JSON.stringify({ error: "Email confirmation does not match" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Create admin client for user deletion
    const adminClient = createClient(supabaseUrl, supabaseServiceKey);

    // Log deletion for GDPR compliance audit trail
    console.log(
      `GDPR Audit: Initiating deletion for user ${userId} (${userEmail})`,
    );
    console.log(
      `GDPR Audit: Data to be deleted - profiles, user_roles, auth.users record`,
    );

    // Delete the user from auth.users (cascades to profiles and user_roles)
    const { error: deleteError } = await adminClient.auth.admin.deleteUser(
      userId,
    );

    if (deleteError) {
      console.error(`GDPR Deletion Failed: ${deleteError.message}`);
      return new Response(
        JSON.stringify({
          error: "Failed to delete account. Please contact support.",
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    console.log(
      `GDPR Deletion Complete: User ${userId} (${userEmail}) successfully deleted at ${
        new Date().toISOString()
      }`,
    );

    // Send confirmation email using Resend
    if (userEmail) {
      try {
        const resendApiKey = Deno.env.get("RESEND_API_KEY");
        if (resendApiKey) {
          const emailHtml = `
            <!DOCTYPE html>
            <html>
            <head>
              <style>
                body { font-family: 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
                .header { text-align: center; margin-bottom: 30px; }
                .logo { color: #4A0E19; font-size: 24px; font-weight: bold; }
                .content { background: #F3E5DC; padding: 30px; border-radius: 8px; }
                h1 { color: #4A0E19; margin-bottom: 20px; }
                .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #666; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <div class="logo">ASPER BEAUTY</div>
                </div>
                <div class="content">
                  <h1>Account Deletion Confirmed</h1>
                  <p>Your Asper Beauty account and all associated personal data has been permanently deleted in accordance with GDPR regulations.</p>
                  <p><strong>Data deleted includes:</strong></p>
                  <ul>
                    <li>Profile information (name, email)</li>
                    <li>Account settings and preferences</li>
                    <li>Authentication credentials</li>
                  </ul>
                  <p><strong>Note:</strong> Order history for completed orders may be retained for legal and accounting purposes as permitted under GDPR Article 17(3).</p>
                  <p>We're sorry to see you go. If you ever wish to return, you're welcome to create a new account at any time.</p>
                  <p>Best regards,<br>The Asper Beauty Team</p>
                </div>
                <div class="footer">
                  <p>This is an automated message confirming your account deletion request.</p>
                  <p>© ${
            new Date().getFullYear()
          } Asper Beauty Shop. All rights reserved.</p>
                </div>
              </div>
            </body>
            </html>
          `;

          const emailResponse = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${resendApiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              from: "Asper Beauty <onboarding@resend.dev>",
              to: [userEmail],
              subject: "Your Asper Beauty Account Has Been Deleted",
              html: emailHtml,
            }),
          });

          if (emailResponse.ok) {
            console.log(
              `GDPR Audit: Deletion confirmation email sent to ${userEmail}`,
            );
          } else {
            console.error(
              "Failed to send deletion confirmation email:",
              await emailResponse.text(),
            );
          }
        }
      } catch (emailError) {
        // Log but don't fail the request - deletion was successful
        console.error(
          "Failed to send deletion confirmation email:",
          emailError,
        );
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Your account has been permanently deleted.",
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Unexpected error in delete-account:", error);
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
