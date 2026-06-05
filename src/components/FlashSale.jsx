import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { Flame, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

import { db } from "../firebase/firebaseConfig";
import ProductCard from "./ProductCard";

export default function FlashSale() {
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
      allProducts
        .filter((item) => item.isFlashSale || Number(item.discount) > 0)
        .slice(0, 10)
    );
  };

  if (products.length === 0) return null;

  return (
    <section className="py-16 bg-red-50">
      <div className="max-w-7xl mx-auto px-5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-red-600 text-white w-14 h-14 rounded-2xl flex items-center justify-center">
              <Flame size={32} />
            </div>

            <div>
              <p className="text-red-600 font-black">LIMITED DEALS</p>
              <h2 className="text-4xl md:text-5xl font-black">
                Flash Sale
              </h2>
            </div>
          </div>

          <Link
            to="/shop"
            className="bg-black text-white px-6 py-3 rounded-full font-black flex items-center gap-2 w-fit"
          >
            View All Deals
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