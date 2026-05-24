import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { Sparkles, Flame, Tags } from "lucide-react";

import { db } from "../firebase/firebaseConfig";
import ProductCard from "./ProductCard";

export default function SmartRecommendations({ currentProduct }) {
  const [sameCategory, setSameCategory] = useState([]);
  const [bestDeals, setBestDeals] = useState([]);
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    if (currentProduct) {
      fetchRecommendations();
    }
  }, [currentProduct]);

  const fetchRecommendations = async () => {
    const snapshot = await getDocs(collection(db, "products"));

    const products = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const otherProducts = products.filter(
      (item) => item.id !== currentProduct.id
    );

    setSameCategory(
      otherProducts
        .filter((item) => item.category === currentProduct.category)
        .slice(0, 4)
    );

    setBestDeals(
      otherProducts
        .filter((item) => item.isFlashSale || Number(item.discount) > 0)
        .slice(0, 4)
    );

    setFeatured(
      otherProducts
        .filter((item) => item.isFeatured)
        .slice(0, 4)
    );
  };

  const Section = ({ title, subtitle, icon: Icon, products }) => {
    if (products.length === 0) return null;

    return (
      <section className="max-w-7xl mx-auto px-5 py-12">
        <div className="mb-8 flex items-center gap-3">
          <div className="bg-orange-100 text-orange-600 w-14 h-14 rounded-2xl flex items-center justify-center">
            <Icon size={28} />
          </div>

          <div>
            <p className="text-orange-600 font-black">{subtitle}</p>
            <h2 className="text-3xl md:text-4xl font-black">{title}</h2>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    );
  };

  return (
    <>
      <Section
        title="Recommended For You"
        subtitle="SMART PICKS"
        icon={Sparkles}
        products={sameCategory}
      />

      <Section
        title="Best Deals"
        subtitle="SAVE MORE"
        icon={Flame}
        products={bestDeals}
      />

      <Section
        title="Featured Products"
        subtitle="CURATED"
        icon={Tags}
        products={featured}
      />
    </>
  );
}