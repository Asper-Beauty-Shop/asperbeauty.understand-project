import { createClient } from 'npm:@supabase/supabase-js@2'
import { renderToStaticMarkup } from 'react-dom/server'
import { ConsultationSummaryEmail } from './templates/consultation-summary.tsx'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
}

const SENDER_DOMAIN = 'notify.asperbeautyshop.com'
const FROM_ADDRESS = `Asper Beauty Shop <noreply@${SENDER_DOMAIN}>`

// Template registry – add new templates here
const TEMPLATES: Record<
  string,
  {
    subject: (data: Record<string, unknown>) => string
    render: (data: Record<string, unknown>) => string
    purpose: string
  }
> = {
  'consultation-summary': {
    subject: (data) =>
      `Your Personalized ${(data.concern_type as string) || 'Beauty'} Consultation — Asper Beauty Shop`,
    render: (data) => renderToStaticMarkup(ConsultationSummaryEmail(data)),
    purpose: 'transactional',
  },
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

    // Authenticate caller
    const authHeader = req.headers.get('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const supabaseClient = createClient(supabaseUrl, supabaseServiceKey)

    // Verify the calling user
    const token = authHeader.replace('Bearer ', '')
    const {
      data: { user },
      error: authError,
    } = await createClient(
      supabaseUrl,
      Deno.env.get('SUPABASE_ANON_KEY') || Deno.env.get('SUPABASE_PUBLISHABLE_KEY')!
    ).auth.getUser(token)

    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const body = await req.json()
    const { template_name, to, data } = body as {
      template_name: string
      to: string
      data: Record<string, unknown>
    }

    if (!template_name || !to) {
      return new Response(
        JSON.stringify({ error: 'template_name and to are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check if user is admin
    const { data: adminRole } = await supabaseClient
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .maybeSingle()

    const isAdmin = !!adminRole

    // Non-admin users can only send to their own email
    if (!isAdmin && to.toLowerCase() !== user.email?.toLowerCase()) {
      return new Response(
        JSON.stringify({ error: 'Forbidden: recipient mismatch' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const template = TEMPLATES[template_name]
    if (!template) {
      return new Response(
        JSON.stringify({ error: `Unknown template: ${template_name}` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check suppression list
    const { data: suppressed } = await supabaseClient
      .from('suppressed_emails')
      .select('id')
      .eq('email', to.toLowerCase())
      .maybeSingle()

    if (suppressed) {
      // Log and skip
      await supabaseClient.from('email_send_log').insert({
        message_id: crypto.randomUUID(),
        template_name,
        recipient_email: to,
        status: 'suppressed',
        error_message: 'Recipient is on suppression list',
      })
      return new Response(
        JSON.stringify({ success: true, suppressed: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Generate or retrieve unsubscribe token
    const { data: existingToken } = await supabaseClient
      .from('email_unsubscribe_tokens')
      .select('token')
      .eq('email', to.toLowerCase())
      .maybeSingle()

    let unsubscribeToken = existingToken?.token
    if (!unsubscribeToken) {
      unsubscribeToken = crypto.randomUUID()
      await supabaseClient.from('email_unsubscribe_tokens').insert({
        email: to.toLowerCase(),
        token: unsubscribeToken,
      })
    }

    // Render template
    const html = template.render({ ...data, unsubscribe_token: unsubscribeToken })
    const subject = template.subject(data)
    const messageId = `${template_name}-${crypto.randomUUID()}`

    // Enqueue to transactional_emails queue
    const payload = {
      to,
      from: FROM_ADDRESS,
      sender_domain: SENDER_DOMAIN,
      subject,
      html,
      purpose: template.purpose,
      label: template_name,
      message_id: messageId,
      idempotency_key: messageId,
      unsubscribe_token: unsubscribeToken,
      queued_at: new Date().toISOString(),
    }

    const { error: enqueueError } = await supabaseClient.rpc('enqueue_email', {
      queue_name: 'transactional_emails',
      payload,
    })

    if (enqueueError) {
      console.error('Failed to enqueue email', enqueueError)
      return new Response(
        JSON.stringify({ error: 'Failed to enqueue email' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Log pending
    await supabaseClient.from('email_send_log').insert({
      message_id: messageId,
      template_name,
      recipient_email: to,
      status: 'pending',
    })

    return new Response(
      JSON.stringify({ success: true, message_id: messageId }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    console.error('send-transactional-email error', err)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
