/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from 'npm:@react-email/components@0.0.22'

interface EmailChangeEmailProps {
  siteName: string
  email: string
  newEmail: string
  confirmationUrl: string
}

export const EmailChangeEmail = ({
  siteName,
  email,
  newEmail,
  confirmationUrl,
}: EmailChangeEmailProps) => (
  <Html lang="en" dir="ltr">
    <Head>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Montserrat:wght@400;500;600&display=swap" rel="stylesheet" />
    </Head>
    <Preview>Confirm your email change — Asper Beauty Shop</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Heading style={brandName}>ASPER BEAUTY SHOP</Heading>
          <Text style={brandTagline}>CLINICAL BEAUTY, REDEFINED</Text>
        </Section>
        <Section style={contentSection}>
          <Heading style={h1}>Confirm Email Change</Heading>
          <Text style={text}>
            You requested to change your email from{' '}
            <Link href={`mailto:${email}`} style={link}>{email}</Link>{' '}to{' '}
            <Link href={`mailto:${newEmail}`} style={link}>{newEmail}</Link>.
          </Text>
          <Text style={text}>Click below to confirm this change:</Text>
          <Section style={buttonWrap}>
            <Button style={button} href={confirmationUrl}>Confirm Email Change</Button>
          </Section>
          <Text style={goldDivider}>—</Text>
          <Text style={footerText}>If you didn't request this change, please secure your account immediately.</Text>
        </Section>
        <Section style={footerSection}>
          <Text style={footerBrand}>Asper Beauty Shop · Clinical Beauty, Redefined</Text>
        </Section>
      </Container>
    </Body>
  </Html>
)

export default EmailChangeEmail

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
const link = { color: MAROON, textDecoration: 'underline' }
const buttonWrap = { textAlign: 'center' as const, margin: '8px 0 24px' }
const button = { backgroundColor: MAROON, color: '#FFFFFF', fontSize: '13px', fontWeight: 600 as const, borderRadius: '0px', padding: '14px 40px', textDecoration: 'none', letterSpacing: '1.5px', textTransform: 'uppercase' as const }
const goldDivider = { fontSize: '14px', color: GOLD, textAlign: 'center' as const, margin: '16px 0' }
const footerText = { fontSize: '12px', color: MUTED, margin: '0' }
const footerSection = { padding: '20px 40px', borderTop: `1px solid ${BORDER}`, textAlign: 'center' as const }
const footerBrand = { margin: '0', fontSize: '11px', color: MUTED }
