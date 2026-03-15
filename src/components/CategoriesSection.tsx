import CategoryCard from "./CategoryCard";
import skincareImage from "@/assets/skincare-category.jpg";
import haircareImage from "@/assets/haircare-category.jpg";
import makeupImage from "@/assets/makeup-category.jpg";
import perfumeImage from "@/assets/perfume-category.jpg";
import bathBodyImage from "@/assets/bath-body-category.jpg";
import babyMotherImage from "@/assets/baby-mother-category.jpg";
import supplementsImage from "@/assets/supplements-category.jpg";

const categories = [
  {
    title: "Skin Care",
    image: skincareImage,
    description: "Premium skincare products for every skin type"
  },
  {
    title: "Hair Care",
    image: haircareImage,
    description: "Professional hair care and styling products"
  },
  {
    title: "Supplements",
    image: supplementsImage,
    description: "Health and beauty supplements for wellness"
  },
  {
    title: "Makeup",
    image: makeupImage,
    description: "High-quality cosmetics and beauty tools"
  },
  {
    title: "Perfume",
    image: perfumeImage,
    description: "Luxury fragrances and signature scents"
  },
  {
    title: "Brands",
    image: makeupImage,
    description: "Top beauty brands and exclusive collections"
  },
  {
    title: "Bath & Body",
    image: bathBodyImage,
    description: "Luxurious bath and body care essentials"
  },
  {
    title: "Baby & Mother",
    image: babyMotherImage,
    description: "Gentle care products for mothers and babies"
  },
  {
    title: "Others",
    image: supplementsImage,
    description: "Additional beauty and wellness products"
  }
];

const CategoriesSection = () => {
  return (
    <section className="py-20 px-6 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Shop by Category
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore our carefully curated collection of beauty and wellness products
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <CategoryCard
              key={index}
              title={category.title}
              image={category.image}
              description={category.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;