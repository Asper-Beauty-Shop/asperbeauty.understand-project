import { useLanguage } from "@/contexts/LanguageContext";

export const FloatingConciergeWidget = () => {
  const { isRTL } = useLanguage();

  const handleClick = () => {
    window.dispatchEvent(new CustomEvent("open-beauty-assistant"));
  };

  return (
    <div
      className={`fixed bottom-6 z-50 flex flex-col items-center group cursor-pointer ${isRTL ? "left-6" : "right-6"}`}
      onClick={handleClick}
      role="button"
      aria-label="Consult Dr. Sami"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && handleClick()}
    >
      {/* Hover label */}
      <span
        className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-sm font-display text-burgundy bg-polished-white/90 px-3 py-1 rounded-full shadow-sm pointer-events-none whitespace-nowrap"
      >
        Consult Dr. Sami
      </span>

      {/* Floating icon — no background box */}
      <div className="relative w-14 h-14 md:w-16 md:h-16 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-110 group-hover:-translate-y-2">
        {/* Mortar & Pestle SVG */}
        <svg
          className="w-full h-full text-burgundy group-hover:text-polished-gold transition-colors duration-500 drop-shadow-[0_4px_8px_rgba(0,0,0,0.1)]"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        {/* Sparkle indicator on hover */}
        <svg
          className="absolute -top-1 -right-1 w-5 h-5 text-polished-gold opacity-0 group-hover:opacity-100 animate-pulse transition-opacity duration-300"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M10 2a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 2zm0 12.5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5a.75.75 0 01.75-.75zM4.75 10a.75.75 0 01-.75.75h-3.5a.75.75 0 010-1.5h3.5a.75.75 0 01.75.75zm13.5 0a.75.75 0 01-.75.75h-3.5a.75.75 0 010-1.5h3.5a.75.75 0 01.75.75zm-9.354 3.854a.75.75 0 011.06 0l2.5 2.5a.75.75 0 01-1.06 1.06l-2.5-2.5a.75.75 0 010-1.06zm6.108-8.81a.75.75 0 010 1.06l-2.5 2.5a.75.75 0 01-1.06-1.06l2.5-2.5a.75.75 0 011.06 0z" />
        </svg>
      </div>
    </div>
  );
};
