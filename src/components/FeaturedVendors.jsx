import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import { Store, BadgeCheck, MapPin, ArrowRight } from "lucide-react";
import { db } from "../firebase/firebaseConfig";

export default function FeaturedVendors() {
  const [vendors, setVendors] = useState([]);

  useEffect(() => {
    getDocs(query(collection(db, "vendors"), where("status", "==", "Approved")))
      .then((snapshot) => setVendors(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))))
      .catch(() => {});
  }, []);

  if (!vendors.length) return null;

  return (
    <section className="py-10 md:py-14 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-5">
        <div className="flex items-end justify-between gap-4 mb-6">
          <div><p className="text-[10px] tracking-[0.14em] text-orange-600 font-extrabold">MARKETPLACE STORES</p><h2 className="text-xl md:text-2xl font-black tracking-tight mt-1">Discover sellers</h2></div>
          <Link to="/vendors" className="text-sm font-bold text-gray-500 hover:text-orange-600 flex items-center gap-1">View all <ArrowRight size={15} /></Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {vendors.slice(0, 8).map((vendor) => (
            <Link to={`/vendor-store/${vendor.userId}`} key={vendor.id} className="group bg-white border border-slate-200 rounded-2xl p-4 hover:border-orange-200 hover:shadow-lg hover:shadow-slate-200/60 transition">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center flex-shrink-0"><Store size={21} /></div>
                <div className="min-w-0"><h3 className="font-black text-sm truncate group-hover:text-orange-600 transition">{vendor.shopName}</h3><p className="flex items-center gap-1 text-[11px] text-emerald-600 font-bold mt-1"><BadgeCheck size={13} /> Approved seller</p></div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2"><p className="text-xs text-gray-500 flex items-center gap-1 truncate"><MapPin size={12} /> {vendor.location || "Ghana"}</p><ArrowRight size={14} className="text-gray-300 group-hover:text-orange-600" /></div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
