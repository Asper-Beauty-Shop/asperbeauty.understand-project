import { useState } from "react";

type LogoStyle = "architectural" | "molecular";

/**
 * Identity tab: toggle between Architectural Seal and Molecular Bloom brand marks.
 * Design tokens: Soft Ivory (#F8F8FF), Deep Maroon (#800020), Shiny Gold (#C5A028).
 */
export function LogoToggle() {
  const [activeLogo, setActiveLogo] = useState<LogoStyle>("architectural");

  return (
    <div className="w-full max-w-4xl rounded-lg border border-shiny-gold/30 bg-soft-ivory p-8 shadow-sm">
      <div className="mb-8 text-center">
        <h2 className="font-serif text-3xl text-maroon mb-2">
          Signature Brand Marks
        </h2>
        <p className="font-sans text-sm text-dark-charcoal">
          Toggle between the standard brand lockup and the clinical hybrid.
        </p>
      </div>

      <div className="mb-10 flex justify-center">
        <div className="inline-flex rounded-full border border-shiny-gold/50 bg-white p-1">
          <button
            type="button"
            onClick={() => setActiveLogo("architectural")}
            className={`rounded-full px-6 py-2 font-sans text-sm transition-all duration-300 ${
              activeLogo === "architectural"
                ? "bg-maroon text-white shadow-md"
                : "text-dark-charcoal hover:text-maroon"
            }`}
          >
            The Architectural Seal
          </button>
          <button
            type="button"
            onClick={() => setActiveLogo("molecular")}
            className={`rounded-full px-6 py-2 font-sans text-sm transition-all duration-300 ${
              activeLogo === "molecular"
                ? "bg-maroon text-white shadow-md"
                : "text-dark-charcoal hover:text-maroon"
            }`}
          >
            The Molecular Bloom
          </button>
        </div>
      </div>

      <div className="relative flex flex-col items-center justify-center rounded-xl border border-gray-100 bg-white p-12 transition-all duration-700">
        {activeLogo === "architectural" && (
          <div className="animate-in fade-in duration-500 text-center">
            <div className="mx-auto mb-6 flex h-32 w-32 items-center justify-center border border-shiny-gold">
              <span className="text-4xl text-shiny-gold" aria-hidden>🪷</span>
            </div>
            <h3 className="font-serif text-2xl tracking-wider text-maroon">
              ASPER
            </h3>
            <p className="mt-1 font-sans text-xs uppercase tracking-widest text-dark-charcoal">
              Beauty Shop
            </p>
            <p className="mx-auto mt-6 max-w-md text-sm italic text-dark-charcoal">
              A stylized symmetrical lotus flower encased in a fine gold square.
              Used as the primary mark of Authentic Quality.
            </p>
          </div>
        )}

        {activeLogo === "molecular" && (
          <div className="animate-in fade-in duration-500 text-center">
            <div className="mx-auto mb-6 flex h-32 w-32 items-center justify-center rounded-full border-2 border-dashed border-maroon">
              <span className="text-4xl text-maroon" aria-hidden>⬡</span>
            </div>
            <h3 className="font-serif text-2xl tracking-wider text-maroon">
              ASPER <span className="font-sans text-lg text-shiny-gold">AI</span>
            </h3>
            <p className="mt-1 font-sans text-xs uppercase tracking-widest text-dark-charcoal">
              Clinical Protocol
            </p>
            <p className="mx-auto mt-6 max-w-md text-sm italic text-dark-charcoal">
              A faceted, geometric petal design built on 60-degree clinical
              facets. Resembles both a chemical molecule and a blooming lotus.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
