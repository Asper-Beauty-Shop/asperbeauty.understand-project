import React from 'react'

const BRAND = {
  maroon: '#800020',
  gold: '#C5A028',
  bgCream: '#FDF8F3',
  textDark: '#1A1A2E',
  textMuted: '#6B7280',
  borderLight: '#E5E0DB',
}

interface RegimenStep {
  title?: string
  brand?: string
  price?: number
  image_url?: string
  step?: string
}

interface ConsultationData {
  concern_type?: string
  skin_type?: string
  sensitivity_level?: string
  ai_summary?: string
  regimen?: RegimenStep[]
  customer_name?: string
  unsubscribe_token?: string
  [key: string]: unknown
}

export function ConsultationSummaryEmail(data: ConsultationData) {
  const {
    concern_type = 'Beauty',
    skin_type,
    sensitivity_level,
    ai_summary,
    regimen = [],
    customer_name,
    unsubscribe_token,
  } = data

  const unsubscribeUrl = unsubscribe_token
    ? `https://dsggmechzloaqevepktp.supabase.co/functions/v1/handle-email-unsubscribe?token=${unsubscribe_token}`
    : null

  return (
    <html>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Montserrat:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ margin: 0, padding: 0, backgroundColor: BRAND.bgCream, fontFamily: 'Montserrat, Arial, sans-serif' }}>
        <table width="100%" cellPadding={0} cellSpacing={0} style={{ backgroundColor: BRAND.bgCream }}>
          <tr>
            <td align="center" style={{ padding: '40px 16px' }}>
              <table width="600" cellPadding={0} cellSpacing={0} style={{ backgroundColor: '#FFFFFF', border: `1px solid ${BRAND.borderLight}` }}>
                {/* Header */}
                <tr>
                  <td style={{ backgroundColor: BRAND.maroon, padding: '32px 40px', textAlign: 'center' as const }}>
                    <h1 style={{ margin: 0, fontFamily: 'Playfair Display, Georgia, serif', fontSize: '24px', fontWeight: 700, color: BRAND.gold, letterSpacing: '1px' }}>
                      ASPER BEAUTY SHOP
                    </h1>
                    <p style={{ margin: '8px 0 0', fontSize: '12px', color: '#FFFFFF', letterSpacing: '3px', textTransform: 'uppercase' as const }}>
                      Your Personalized Consultation
                    </p>
                  </td>
                </tr>

                {/* Greeting */}
                <tr>
                  <td style={{ padding: '32px 40px 16px' }}>
                    <p style={{ margin: 0, fontSize: '16px', color: BRAND.textDark, lineHeight: '1.6' }}>
                      {customer_name ? `Dear ${customer_name},` : 'Dear Valued Client,'}
                    </p>
                    <p style={{ margin: '12px 0 0', fontSize: '14px', color: BRAND.textMuted, lineHeight: '1.7' }}>
                      Thank you for consulting with our AI Beauty Advisor. Here's a summary of your personalized consultation results.
                    </p>
                  </td>
                </tr>

                {/* Profile Card */}
                <tr>
                  <td style={{ padding: '0 40px 24px' }}>
                    <table width="100%" cellPadding={0} cellSpacing={0} style={{ backgroundColor: BRAND.bgCream, border: `1px solid ${BRAND.borderLight}` }}>
                      <tr>
                        <td style={{ padding: '20px 24px' }}>
                          <p style={{ margin: '0 0 12px', fontFamily: 'Playfair Display, Georgia, serif', fontSize: '16px', fontWeight: 600, color: BRAND.maroon }}>
                            Your Skin Profile
                          </p>
                          <table width="100%" cellPadding={0} cellSpacing={0}>
                            {concern_type && (
                              <tr>
                                <td style={{ padding: '4px 0', fontSize: '13px', color: BRAND.textMuted, width: '120px' }}>Concern:</td>
                                <td style={{ padding: '4px 0', fontSize: '13px', color: BRAND.textDark, fontWeight: 600 }}>{concern_type.replace('Concern_', '').replace(/([A-Z])/g, ' $1').trim()}</td>
                              </tr>
                            )}
                            {skin_type && (
                              <tr>
                                <td style={{ padding: '4px 0', fontSize: '13px', color: BRAND.textMuted }}>Skin Type:</td>
                                <td style={{ padding: '4px 0', fontSize: '13px', color: BRAND.textDark, fontWeight: 600 }}>{skin_type}</td>
                              </tr>
                            )}
                            {sensitivity_level && (
                              <tr>
                                <td style={{ padding: '4px 0', fontSize: '13px', color: BRAND.textMuted }}>Sensitivity:</td>
                                <td style={{ padding: '4px 0', fontSize: '13px', color: BRAND.textDark, fontWeight: 600 }}>{sensitivity_level}</td>
                              </tr>
                            )}
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                {/* AI Summary */}
                {ai_summary && (
                  <tr>
                    <td style={{ padding: '0 40px 24px' }}>
                      <p style={{ margin: '0 0 8px', fontFamily: 'Playfair Display, Georgia, serif', fontSize: '16px', fontWeight: 600, color: BRAND.maroon }}>
                        Expert Recommendation
                      </p>
                      <p style={{ margin: 0, fontSize: '14px', color: BRAND.textDark, lineHeight: '1.7' }}>
                        {ai_summary as string}
                      </p>
                    </td>
                  </tr>
                )}

                {/* Regimen Steps */}
                {regimen.length > 0 && (
                  <tr>
                    <td style={{ padding: '0 40px 24px' }}>
                      <p style={{ margin: '0 0 16px', fontFamily: 'Playfair Display, Georgia, serif', fontSize: '16px', fontWeight: 600, color: BRAND.maroon }}>
                        Your Recommended Regimen
                      </p>
                      {regimen.map((step, i) => (
                        <table key={i} width="100%" cellPadding={0} cellSpacing={0} style={{ marginBottom: '12px', border: `1px solid ${BRAND.borderLight}` }}>
                          <tr>
                            <td style={{ padding: '16px 20px' }}>
                              <p style={{ margin: '0 0 4px', fontSize: '11px', color: BRAND.gold, fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '1.5px' }}>
                                {step.step?.replace(/_/g, ' ') || `Step ${i + 1}`}
                              </p>
                              <p style={{ margin: '0 0 2px', fontSize: '14px', fontWeight: 600, color: BRAND.textDark }}>
                                {step.title}
                              </p>
                              {step.brand && (
                                <p style={{ margin: 0, fontSize: '12px', color: BRAND.textMuted }}>
                                  by {step.brand} {step.price ? `— $${step.price}` : ''}
                                </p>
                              )}
                            </td>
                          </tr>
                        </table>
                      ))}
                    </td>
                  </tr>
                )}

                {/* CTA */}
                <tr>
                  <td style={{ padding: '8px 40px 32px', textAlign: 'center' as const }}>
                    <a
                      href="https://www-asperbeautyshop-com.lovable.app"
                      style={{
                        display: 'inline-block',
                        padding: '14px 40px',
                        backgroundColor: BRAND.maroon,
                        color: '#FFFFFF',
                        fontSize: '13px',
                        fontWeight: 600,
                        textDecoration: 'none',
                        letterSpacing: '1.5px',
                        textTransform: 'uppercase' as const,
                      }}
                    >
                      Shop Your Regimen
                    </a>
                  </td>
                </tr>

                {/* Footer */}
                <tr>
                  <td style={{ padding: '24px 40px', borderTop: `1px solid ${BRAND.borderLight}`, textAlign: 'center' as const }}>
                    <p style={{ margin: 0, fontSize: '11px', color: BRAND.textMuted, lineHeight: '1.6' }}>
                      Asper Beauty Shop · Clinical Beauty, Redefined
                    </p>
                    {unsubscribeUrl && (
                      <p style={{ margin: '8px 0 0', fontSize: '11px' }}>
                        <a href={unsubscribeUrl} style={{ color: BRAND.textMuted, textDecoration: 'underline' }}>
                          Unsubscribe
                        </a>
                      </p>
                    )}
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  )
}
