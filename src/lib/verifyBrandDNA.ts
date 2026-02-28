/**
 * Asper Beauty Shop - Clinical DNA Verification ("DNA Guard")
 * Quality-control check that design tokens (Authentic Quality / Ivory & Gold) are active.
 * Runs in console; use in development and production to catch theme regressions.
 */

const EXPECTED = {
  "soft-ivory": "#F8F8FF", // The Digital Tray
  maroon: "#800020", // The Pharmacist's Stamp
  "shiny-gold": "#C5A028", // Seal of Authenticity
} as const;

function hexToRgb(hex: string): string {
  const n = parseInt(hex.slice(1), 16);
  const r = (n >> 16) & 0xff;
  const g = (n >> 8) & 0xff;
  const b = n & 0xff;
  return `rgb(${r}, ${g}, ${b})`;
}

function normalizeRgb(computed: string): string {
  if (computed.startsWith("rgb(")) return computed;
  if (computed.startsWith("rgba(")) {
    const m = computed.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (m) return `rgb(${m[1]}, ${m[2]}, ${m[3]})`;
  }
  return computed;
}

/**
 * Verifies that Tailwind brand tokens resolve to the expected hex values.
 * Uses a temporary element with utility classes so it works with compiled Tailwind.
 */
export function verifyBrandDNA(): void {
  if (typeof document === "undefined") return;

  const root = document.createElement("div");
  root.setAttribute("aria-hidden", "true");
  root.style.cssText = "position:absolute;left:-9999px;top:0;";
  root.innerHTML = `
    <div id="asper-dna-ivory" class="bg-soft-ivory"></div>
    <div id="asper-dna-maroon" class="text-maroon"></div>
    <div id="asper-dna-gold" class="border-shiny-gold border"></div>
  `;
  document.body.appendChild(root);

  const ivoryEl = root.querySelector("#asper-dna-ivory") as HTMLElement;
  const maroonEl = root.querySelector("#asper-dna-maroon") as HTMLElement;
  const goldEl = root.querySelector("#asper-dna-gold") as HTMLElement;

  const ivory = ivoryEl
    ? normalizeRgb(getComputedStyle(ivoryEl).backgroundColor)
    : "";
  const maroon = maroonEl ? normalizeRgb(getComputedStyle(maroonEl).color) : "";
  const gold = goldEl ? normalizeRgb(getComputedStyle(goldEl).borderColor) : "";

  document.body.removeChild(root);

  const expectedIvory = hexToRgb(EXPECTED["soft-ivory"]);
  const expectedMaroon = hexToRgb(EXPECTED.maroon);
  const expectedGold = hexToRgb(EXPECTED["shiny-gold"]);

  const ok = ivory === expectedIvory &&
    maroon === expectedMaroon &&
    gold === expectedGold;

  if (!ok) {
    console.error(
      "⚠️ ASPER BRAND ALERT: Clinical DNA Mismatch. Check Tailwind config and index.css.",
      { ivory, expectedIvory, maroon, expectedMaroon, gold, expectedGold },
    );
  } else {
    console.log(
      "✅ Asper Beauty Shop: Brand DNA Verified. Ready for consultation.",
    );
  }
}
