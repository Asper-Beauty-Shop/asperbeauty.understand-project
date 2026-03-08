

# Brand Copy Replacement Plan

## Overview
Replace all placeholder slogans and text across the site with your official brand copy. The primary hero headline becomes **"Curated by Pharmacists. Powered by Intelligence."** and secondary copy uses the other taglines you provided.

## Copy Mapping

| Location | Current Text | New Text |
|---|---|---|
| **AmbientVideoHero** (main homepage hero) | | |
| — Campaign tag | "Clinical Luxury" / "جمال طبّي فاخر" | "The Future of Dermo-Retail" / "مستقبل التجزئة الجلدية" |
| — Headline | "The Architecture of Healthy Skin." | **"Curated by Pharmacists. Powered by Intelligence."** |
| — Subtitle | "Where dermatological science meets authentic beauty…" | "We are not just selling cosmetics; we are dispensing beauty through intelligence." |
| **SplashScreen** tagline | "The Sanctuary of Science" | "Where Science Meets Soul" |
| **Hero.tsx** (alternate hero) | "Wonder Women Edit" | "Curated by Pharmacists. Built for Trust. Designed for Elegance." |
| **Hero.tsx** subtitle | "Discover the brands built by visionary female founders…" | "Trusted Solutions for Ageless Radiance" |
| **Hero.tsx** campaign tag | "Exclusive Edit" | "Intelligent. Authentic. Eternal." |
| **HeroSlider.tsx** Slide 2 | "Wonder Women / Edit" | "Curated by Pharmacists / Built for Trust" |
| **Old Hero.tsx** (src/components/Hero.tsx) | "Parisian Science. Jordanian Elegance." | "Curated by Pharmacists. Powered by Intelligence." |
| **PromotionBar** messages | Current 3 messages | Keep existing (delivery, gifting, consultations) — unchanged per your selection |
| **About section** philosophy title | "Beauty in Simplicity" | "Where Science Meets Soul" |
| **About section** body text | Generic placeholder paragraphs | Mission-aligned copy emphasizing pharmacist curation, AI intelligence, and clinical authenticity |
| **BrandShowcase** typography samples | "The Sanctuary of Science" | "Curated by Pharmacists. Powered by Intelligence." |

## Files to Modify (7 files)

1. **`src/components/home/AmbientVideoHero.tsx`** — Update campaign tag, headline, and subtitle (EN + AR)
2. **`src/components/SplashScreen.tsx`** — Change tagline to "Where Science Meets Soul"
3. **`src/components/home/Hero.tsx`** — Replace "Wonder Women Edit" with brand slogans
4. **`src/components/home/HeroSlider.tsx`** — Update Slide 2 copy
5. **`src/components/Hero.tsx`** — Replace "Parisian Science. Jordanian Elegance."
6. **`src/components/About.tsx`** — Rewrite philosophy title and body paragraphs
7. **`src/pages/BrandShowcase.tsx`** — Update typography samples

## Arabic Translations

All updated English copy will have corresponding Arabic translations:
- "Curated by Pharmacists. Powered by Intelligence." → "مُنتقاة من الصيادلة. مدعومة بالذكاء."
- "Where Science Meets Soul" → "حيث يلتقي العلم بالروح"
- "Intelligent. Authentic. Eternal." → "ذكي. أصيل. خالد."
- "We are not just selling cosmetics; we are dispensing beauty through intelligence." → "نحن لا نبيع مستحضرات التجميل فحسب؛ بل نوزّع الجمال بذكاء."

## Approach
- Direct string replacements — no structural or layout changes
- All existing animations, styling, and responsive behavior preserved
- Uploaded media files will be addressed in a separate follow-up task

