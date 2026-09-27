import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { Flame, ArrowRight, Clock3 } from "lucide-react";
import { Link } from "react-router-dom";
import { db } from "../firebase/firebaseConfig";
import ProductCard from "./ProductCard";

export default function FlashSale() {
  const [products, setProducts] = useState([]);
  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 59, seconds: 59 });

  useEffect(() => {
    getDocs(collection(db, "products")).then((snapshot) => {
      const all = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setProducts(all.filter((item) => item.isFlashSale || Number(item.discount) > 0).slice(0, 10));
    }).catch(() => {});
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { hours, minutes, seconds } = prev;
        if (seconds > 0) seconds -= 1;
        else if (minutes > 0) { seconds = 59; minutes -= 1; }
        else if (hours > 0) { seconds = 59; minutes = 59; hours -= 1; }
        else return { hours: 2, minutes: 59, seconds: 59 };
        return { hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!products.length) return null;
  const units = [["HRS", timeLeft.hours], ["MIN", timeLeft.minutes], ["SEC", timeLeft.seconds]];

  return (
    <section className="py-10 md:py-14 bg-orange-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-5">
        <div className="bg-gray-950 text-white rounded-2xl md:rounded-3xl px-5 py-5 md:px-7 md:py-6 mb-6 flex flex-col md:flex-row md:items-center gap-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center"><Flame size={20} /></div>
            <div><p className="text-[10px] tracking-[0.14em] text-red-400 font-extrabold">LIMITED-TIME DEALS</p><h2 className="text-xl md:text-2xl font-black">Flash sale</h2></div>
          </div>

          <div className="flex items-center gap-2 md:ml-auto">
            <Clock3 size={15} className="text-gray-400" />
            {units.map(([label, value]) => <div key={label} className="bg-white/10 rounded-lg px-2.5 py-1.5 text-center min-w-[48px]"><p className="text-sm font-black">{String(value).padStart(2, "0")}</p><p className="text-[8px] text-gray-400 font-bold">{label}</p></div>)}
          </div>

          <Link to="/shop?deals=true" className="bg-orange-600 hover:bg-orange-500 px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 md:w-auto">View deals <ArrowRight size={15} /></Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-5">
          {products.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      </div>
    </section>
  );
}
