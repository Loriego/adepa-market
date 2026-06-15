import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { Crown } from "lucide-react";

import ProductCard from "./ProductCard";
import { db } from "../firebase/firebaseConfig";

export default function SponsoredProducts() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const snapshot = await getDocs(collection(db, "products"));

      const allProducts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const sponsoredProducts = allProducts.filter(
        (product) => product.sponsored === true
      );

      setProducts(sponsoredProducts);
    } catch (error) {
      console.log(error);
    }
  };

  if (products.length === 0) return null;

  return (
    <section className="py-16 bg-gradient-to-r from-yellow-50 via-orange-50 to-yellow-50">
      <div className="max-w-7xl mx-auto px-5">
        <div className="flex items-center gap-3 mb-8">
          <Crown size={36} className="text-yellow-500" />

          <div>
            <p className="font-black text-yellow-600">
              PREMIUM PLACEMENTS
            </p>

            <h2 className="text-4xl md:text-5xl font-black">
              Sponsored Products
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>
      </div>
    </section>
  );
}