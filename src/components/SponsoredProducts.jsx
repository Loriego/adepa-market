import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { Crown, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import ProductCard from "./ProductCard";
import { db } from "../firebase/firebaseConfig";

export default function SponsoredProducts() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getDocs(collection(db, "products")).then((snapshot) => {
      const all = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setProducts(all.filter((product) => product.sponsored === true).slice(0, 10));
    }).catch(() => {});
  }, []);

  if (!products.length) return null;

  return (
    <section className="py-10 md:py-14 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-5">
        <div className="flex items-end justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center"><Crown size={18} /></div>
            <div><p className="text-[10px] tracking-[0.14em] text-amber-600 font-extrabold">SPONSORED</p><h2 className="text-xl md:text-2xl font-black tracking-tight">Featured by sellers</h2></div>
          </div>
          <Link to="/shop" className="hidden sm:flex text-sm font-bold text-gray-500 hover:text-orange-600 items-center gap-1">See more <ArrowRight size={15} /></Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-5">{products.map((product) => <ProductCard key={product.id} product={product} />)}</div>
      </div>
    </section>
  );
}
