import React from 'react';

interface Product {
  id: string;
  title: string;
  price: string;
  imageUrl: string;
  category: string;
}

const MOCK_PRODUCTS: Product[] = [
  { id: '1', title: 'Clinical Retinol 1.0 High-Potency', price: '45.00 JOD', imageUrl: '/placeholder.svg', category: 'Targeted Serums' },
  { id: '2', title: 'Hyaluronic Barrier Repair Complex', price: '32.50 JOD', imageUrl: '/placeholder.svg', category: 'Daily Hydration' },
  { id: '3', title: 'Mineral Shield SPF 50+ Invisible', price: '28.00 JOD', imageUrl: '/placeholder.svg', category: 'Sun Protection' },
  { id: '4', title: 'Dual-Acid Resurfacing Botanical Wash', price: '24.00 JOD', imageUrl: '/placeholder.svg', category: 'Clinical Cleansers' },
];

/**
 * ProductCrossSellGrid - A "Clinical Luxury" component for cross-selling related items.
 * Uses strict CSS Grid and enforces negative space for a premium aesthetic.
 */
const ProductCrossSellGrid: React.FC = () => {
  return (
    <section className="bg-[#F8F8FF] py-16 px-4 sm:px-6 md:px-8 border-y border-[#C5A028]/10" data-testid="cross-sell-section">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10 text-left">
          <span className="text-[11px] uppercase tracking-[0.3em] text-[#800020]/70 font-bold block mb-2">
            Professional Recommendation
          </span>
          <h3 className="font-display text-3xl md:text-4xl text-[#1A1A1A] tracking-tight">
            Complete Your <span className="text-[#800020]">Clinical Protocol</span>
          </h3>
          <div className="h-1 w-20 bg-[#800020] mt-4" />
        </header>

        {/* 1. CSS Grid Implementation (Mandatory) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 lg:gap-10">
          {MOCK_PRODUCTS.map((product) => (
            <div 
              key={product.id} 
              className="group relative bg-white border border-[#C5A028]/15 p-4 sm:p-6 transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] hover:shadow-[0_20px_50px_-15px_rgba(128,0,32,0.12)] hover:border-[#800020]/30 hover:-translate-y-1 overflow-hidden"
              data-testid={`product-card-${product.id}`}
            >
              {/* Image Container with negative space */}
              <div className="aspect-[4/5] overflow-hidden mb-6 bg-[#F8F8FF] relative">
                <img 
                  src={product.imageUrl} 
                  alt={product.title}
                  className="w-full h-full object-contain p-4 transition-transform duration-1000 group-hover:scale-105"
                  loading="lazy"
                />
                {/* Asper Shine overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-[#800020]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              </div>

              {/* Product Metadata */}
              <div className="flex flex-col h-full">
                <span className="text-[10px] uppercase tracking-widest text-[#800020] font-bold mb-2">
                  {product.category}
                </span>
                <h4 className="font-display text-base md:text-lg text-[#1A1A1A] mb-3 leading-tight min-h-[3rem]">
                  {product.title}
                </h4>
                
                {/* 3. Action Row with data-testid */}
                <div className="mt-auto pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <span className="font-body text-[#1A1A1A] font-bold tracking-tight">
                    {product.price}
                  </span>
                  <button 
                    data-testid={`cta-add-regimen-${product.id}`}
                    className="relative px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-[#800020] border border-[#800020] transition-all duration-300 hover:bg-[#800020] hover:text-white active:scale-95 overflow-hidden group/btn"
                  >
                    <span className="relative z-10 transition-colors duration-300">Add to Regimen</span>
                    <div className="absolute inset-0 bg-[#800020] translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductCrossSellGrid;
