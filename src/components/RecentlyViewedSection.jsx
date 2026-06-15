import { useRecentlyViewed } from "../context/RecentlyViewedContext";
import ProductCard from "./ProductCard";

export default function RecentlyViewedSection() {
  const { recentlyViewed } = useRecentlyViewed();

  if (!recentlyViewed || recentlyViewed.length === 0) {
    return null;
  }

  return (
    <section className="max-w-7xl mx-auto px-5 py-16">
      <div className="mb-8">
        <p className="text-orange-600 font-black">
          YOUR ACTIVITY
        </p>

        <h2 className="text-5xl font-black mt-2">
          Recently Viewed
        </h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
        {recentlyViewed.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
          />
        ))}
      </div>
    </section>
  );
}