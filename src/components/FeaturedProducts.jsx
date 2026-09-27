import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { Sparkles, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

import { db } from "../firebase/firebaseConfig";
import ProductCard from "./ProductCard";

export default function FeaturedProducts() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const snapshot = await getDocs(collection(db, "products"));

    const allProducts = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setProducts(
      allProducts.filter((item) => item.isFeatured).slice(0, 10)
    );
  };

  if (products.length === 0) return null;

  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-orange-50 text-orange-600 w-11 h-11 rounded-xl flex items-center justify-center">
              <Sparkles size={21} />
            </div>

            <div>
              <p className="text-orange-600 text-xs tracking-[0.14em] font-extrabold">
                CURATED COLLECTION
              </p>

              <h2 className="text-2xl md:text-3xl font-black tracking-tight">
                Featured Products
              </h2>
            </div>
          </div>

          <Link
            to="/shop"
            className="bg-gray-950 hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl text-sm font-extrabold flex items-center gap-2 w-fit transition"
          >
            Explore More
            <ArrowRight size={18} />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}