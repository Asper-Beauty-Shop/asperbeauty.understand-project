/**
 * Asper Category Architecture — Sanctuary UX
 * Clinical taxonomy, trust bar, intent-based filters, Digital Trays grid.
 * See docs/PAGE_STRUCTURE_SPEC.md and DESIGN_SYSTEM.md.
 */
import { useState } from "react";
import { Link } from "react-router-dom";

export interface CategoryProduct {
  id: string;
  title: string;
  category: string;
  price: string;
  handle?: string;
  image_url?: string | null;
}

const DEFAULT_PRODUCTS: CategoryProduct[] = [
  { id: "1", title: "La Roche-Posay Effaclar", category: "Targeted Treatment", price: "24.00 JOD" },
  { id: "2", title: "Vichy Mineral 89", category: "Hydration", price: "32.00 JOD" },
  { id: "3", title: "CeraVe Hydrating Cleanser", category: "Daily Wash", price: "18.50 JOD" },
  { id: "4", title: "Eucerin Oil Control SPF 50", category: "Suncare", price: "26.00 JOD" },
];

const NAV_CATEGORIES = [
  "Health & Clinical",
  "Skincare",
  "The Morning Spa",
  "Fragrance",
  "Brands Index",
] as const;

interface AsperCategoryArchitectureProps {
  products?: CategoryProduct[];
  categoryTitle?: string;
  categoryDescription?: string;
  onAddToTray?: (product: CategoryProduct) => void;
}

export default function AsperCategoryArchitecture({
  products = DEFAULT_PRODUCTS,
  categoryTitle = "Advanced Skincare",
  categoryDescription = "Dermatologically tested solutions curated by our clinical team for optimal skin barrier health.",
  onAddToTray,
}: AsperCategoryArchitectureProps) {
  const [activeFilter, setActiveFilter] = useState("All");

  return (
    <div className="min-h-screen bg-soft-ivory text-dark-charcoal font-body rtl:font-arabic">
      {/* Trust anchors (Sanctuary header) */}
      <header
        className="border-b border-shiny-gold/20 bg-white"
        role="banner"
      >
        <div className="mx-auto max-w-7xl px-4 py-3 flex justify-between items-center text-sm font-medium">
          <span className="text-maroon">Pharmacist Curated</span>
          <span className="hidden md:inline text-dark-charcoal">
            100% Authentic Quality Guaranteed
          </span>
          <span className="text-dark-charcoal">Secure Delivery</span>
        </div>
      </header>

      {/* Main taxonomy navigation — ARIA: Clinical / Beauty */}
      <nav
        className="bg-soft-ivory py-6 sticky top-0 z-50 border-b border-border"
        aria-label="Clinical Categories"
      >
        <div className="mx-auto max-w-7xl px-4 flex gap-8 overflow-x-auto hide-scrollbar">
          {NAV_CATEGORIES.map((category) => (
            <Link
              key={category}
              to={`/products?category=${encodeURIComponent(category)}`}
              className="whitespace-nowrap font-serif text-lg text-dark-charcoal hover:text-maroon transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-shiny-gold focus:ring-offset-2 rounded"
            >
              {category}
            </Link>
          ))}
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 py-12">
        {/* Category header & intent-based filters */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-10 border-b border-border pb-6">
          <div>
            <h1 className="font-serif text-4xl text-maroon mb-2">
              {categoryTitle}
            </h1>
            <p className="text-dark-charcoal max-w-2xl">{categoryDescription}</p>
          </div>

          <div className="flex gap-4 mt-6 md:mt-0">
            <select
              className="bg-white border border-shiny-gold/50 text-dark-charcoal py-2 px-4 rounded focus:ring-1 focus:ring-maroon focus:outline-none cursor-pointer font-body"
              value={activeFilter}
              onChange={(e) => setActiveFilter(e.target.value)}
              aria-label="Filter by Clinical Concern"
            >
              <option value="All">Filter by Clinical Concern</option>
              <option value="Acne">Acne & Blemishes</option>
              <option value="Rosacea">Rosacea & Redness</option>
              <option value="Barrier">Barrier Repair</option>
              <option value="Pregnancy">Pregnancy Safe</option>
            </select>
          </div>
        </div>

        {/* Digital Trays — product grid (Gold Stitch on hover) */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          role="list"
        >
          {products.map((product) => (
            <article
              key={product.id}
              className="bg-white p-5 flex flex-col h-full border border-transparent hover:border-shiny-gold transition-all duration-300 rounded-lg"
              role="listitem"
            >
              <Link
                to={product.handle ? `/products/${product.handle}` : `/products?id=${product.id}`}
                className="flex flex-col flex-grow group/link"
              >
                <div className="aspect-square bg-soft-ivory mb-5 flex items-center justify-center overflow-hidden rounded">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-sm opacity-40 font-medium tracking-wide">
                      Product Image
                    </span>
                  )}
                </div>
                <div className="flex-grow">
                  <span className="text-xs uppercase tracking-wider text-shiny-gold font-bold mb-1 block">
                    {product.category}
                  </span>
                  <h2 className="font-serif text-xl text-dark-charcoal leading-tight mb-3 group-hover/link:text-maroon transition-colors">
                    {product.title}
                  </h2>
                </div>
              </Link>
              <div className="mt-4 pt-4 border-t border-border flex justify-between items-center gap-2">
                <span className="font-bold text-lg text-dark-charcoal">
                  {product.price}
                </span>
                <button
                  type="button"
                  className="bg-maroon text-white px-4 py-2 text-sm font-semibold rounded hover:bg-maroon/90 transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-shiny-gold focus:outline-none shrink-0"
                  aria-label={`Add ${product.title} to tray`}
                  onClick={() => onAddToTray?.(product)}
                >
                  Add to Tray
                </button>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
