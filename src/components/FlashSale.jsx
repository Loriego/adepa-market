import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { Flame } from "lucide-react";

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

    setProducts(allProducts.filter((item) => item.isFlashSale));
  };

  return (
    <section className="py-20 bg-red-50">
      <div className="max-w-7xl mx-auto px-5">

        <div className="flex items-center gap-3 mb-10">
          <Flame className="text-red-600" size={40} />

          <div>
            <p className="text-red-600 font-black">LIMITED DEALS</p>

            <h2 className="text-4xl md:text-5xl font-black">
              Flash Sale
            </h2>
          </div>
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