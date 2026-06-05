import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { TrendingUp, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

import { db } from "../firebase/firebaseConfig";
import ProductCard from "./ProductCard";

export default function TrendingProducts() {
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

    setProducts(allProducts.slice(0, 10));
  };

  if (products.length === 0) return null;

  return (
    <section className="py-16 bg-slate-100">
      <div className="max-w-7xl mx-auto px-5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-black text-white w-14 h-14 rounded-2xl flex items-center justify-center">
              <TrendingUp size={30} />
            </div>

            <div>
              <p className="text-orange-600 font-black">
                TRENDING NOW
              </p>

              <h2 className="text-4xl md:text-5xl font-black">
                Popular Products
              </h2>
            </div>
          </div>

          <Link
            to="/shop"
            className="bg-orange-600 text-white px-6 py-3 rounded-full font-black flex items-center gap-2 w-fit"
          >
            View Marketplace
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