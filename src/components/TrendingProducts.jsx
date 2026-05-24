import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";

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

    setProducts(allProducts.slice(0, 8));
  };

  return (
    <section className="py-20 bg-slate-100">
      <div className="max-w-7xl mx-auto px-5">

        <div className="mb-10">
          <p className="text-orange-600 font-black">
            TRENDING NOW
          </p>

          <h2 className="text-4xl md:text-5xl font-black">
            Popular Products
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}