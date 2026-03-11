/**
 * Asper Beauty Shop — Tailwind design tokens
 * Paste the "theme.extend" (or "theme") block into your understand-project
 * tailwind.config.js so classes like bg-asper-stone, text-burgundy work.
 *
 * Repo: asperpharma/understand-project
 * See: DESIGN_SYSTEM.md
 */

module.exports = {
  theme: {
    extend: {
      colors: {
        'asper-stone': {
          DEFAULT: '#F2EFEB',
          light: '#F8F6F3',
          dark: '#E8E4DE',
        },
        'rose-clay': {
          DEFAULT: '#C4A494',
          light: '#D4B8A8',
          dark: '#A88B7A',
        },
        burgundy: {
          DEFAULT: '#6B2D3A',
          light: '#8B3D4A',
          dark: '#4F222C',
        },
        'polished-gold': '#C9A962',
        'polished-white': '#FAF9F7',
        'asper-ink': '#2C2825',
        'asper-ink-muted': '#5C5652',
      },
      transitionDuration: {
        smooth: '300ms',
      },
    },
  },
};
