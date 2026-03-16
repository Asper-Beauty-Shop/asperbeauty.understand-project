/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'

import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from 'npm:@react-email/components@0.0.22'

interface ReauthenticationEmailProps {
  token: string
}

export const ReauthenticationEmail = ({ token }: ReauthenticationEmailProps) => (
  <Html lang="en" dir="ltr">
    <Head>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Montserrat:wght@400;500;600&display=swap" rel="stylesheet" />
    </Head>
    <Preview>Your verification code — Asper Beauty Shop</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Heading style={brandName}>ASPER BEAUTY SHOP</Heading>
          <Text style={brandTagline}>CLINICAL BEAUTY, REDEFINED</Text>
        </Section>
        <Section style={contentSection}>
          <Heading style={h1}>Confirm Your Identity</Heading>
          <Text style={text}>Use the code below to verify your identity:</Text>
          <Text style={codeStyle}>{token}</Text>
          <Text style={goldDivider}>—</Text>
          <Text style={footerText}>
            This code will expire shortly. If you didn't request this, you can safely ignore this email.
          </Text>
        </Section>
        <Section style={footerSection}>
          <Text style={footerBrand}>Asper Beauty Shop · Clinical Beauty, Redefined</Text>
        </Section>
      </Container>
    </Body>
  </Html>
)

export default ReauthenticationEmail

const MAROON = '#800020'
const GOLD = '#C5A028'
const CREAM = '#FDF8F3'
const INK = '#1A1A2E'
const MUTED = '#6B7280'
const BORDER = '#E5E0DB'

const main = { backgroundColor: CREAM, fontFamily: 'Montserrat, Arial, sans-serif' }
const container = { maxWidth: '600px', margin: '0 auto', backgroundColor: '#FFFFFF', border: `1px solid ${BORDER}` }
const header = { backgroundColor: MAROON, padding: '32px 40px', textAlign: 'center' as const }
const brandName = { margin: '0', fontFamily: 'Playfair Display, Georgia, serif', fontSize: '22px', fontWeight: 700 as const, color: GOLD, letterSpacing: '1px' }
const brandTagline = { margin: '6px 0 0', fontSize: '10px', color: '#FFFFFF', letterSpacing: '3px', textTransform: 'uppercase' as const }
const contentSection = { padding: '32px 40px' }
const h1 = { fontSize: '20px', fontWeight: 700 as const, color: MAROON, margin: '0 0 16px', fontFamily: 'Playfair Display, Georgia, serif' }
const text = { fontSize: '14px', color: INK, lineHeight: '1.7', margin: '0 0 20px' }
const codeStyle = { fontFamily: 'Courier, monospace', fontSize: '28px', fontWeight: 700 as const, color: MAROON, margin: '0 0 24px', textAlign: 'center' as const, letterSpacing: '4px', backgroundColor: CREAM, padding: '16px', border: `1px solid ${BORDER}` }
const goldDivider = { fontSize: '14px', color: GOLD, textAlign: 'center' as const, margin: '16px 0' }
const footerText = { fontSize: '12px', color: MUTED, margin: '0' }
const footerSection = { padding: '20px 40px', borderTop: `1px solid ${BORDER}`, textAlign: 'center' as const }
const footerBrand = { margin: '0', fontSize: '11px', color: MUTED }
