import { LuxuryProductCard } from "./LuxuryProductCard";

interface Product {
  id: string;
  title: string;
  category: string;
  price: string | number;
  image_url: string;
  is_new?: boolean;
}

interface SimpleProductGridProps {
  products: Product[];
}

export const SimpleProductGrid = ({ products }: SimpleProductGridProps) => {
  return (
    <div className="container mx-auto px-2 md:px-4">
      {
        /* Grid Logic:
          grid-cols-2 (Mobile: 2 items per row)
          lg:grid-cols-4 (Desktop: 4 items per row)
          gap-2 (Mobile: tight spacing for high-density)
          md:gap-8 (Desktop: generous luxury spacing)
      */
      }
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-8">
        {products.map((product) => (
          <LuxuryProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default SimpleProductGrid;
