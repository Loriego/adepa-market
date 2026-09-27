import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { TrendingUp, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { db } from "../firebase/firebaseConfig";
import ProductCard from "./ProductCard";

export default function TrendingProducts() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getDocs(collection(db, "products")).then((snapshot) => {
      setProducts(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })).slice(0, 10));
    }).catch(() => {});
  }, []);

  if (!products.length) return null;

  return (
    <section className="py-10 md:py-14 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-5">
        <div className="flex items-end justify-between gap-4 mb-6">
          <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-gray-950 text-white flex items-center justify-center"><TrendingUp size={18} /></div><div><p className="text-[10px] tracking-[0.14em] text-orange-600 font-extrabold">DISCOVER MORE</p><h2 className="text-xl md:text-2xl font-black tracking-tight">Popular right now</h2></div></div>
          <Link to="/shop" className="hidden sm:flex text-sm font-bold text-gray-500 hover:text-orange-600 items-center gap-1">View marketplace <ArrowRight size={15} /></Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-5">{products.map((product) => <ProductCard key={product.id} product={product} />)}</div>
      </div>
    </section>
  );
}
