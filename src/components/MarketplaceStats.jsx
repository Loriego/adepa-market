import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { Package, Store, ShieldCheck, Headphones } from "lucide-react";
import { db } from "../firebase/firebaseConfig";

export default function MarketplaceStats() {
  const [stats, setStats] = useState({ products: 0, vendors: 0 });

  useEffect(() => {
    Promise.all([getDocs(collection(db, "products")), getDocs(collection(db, "vendors"))])
      .then(([products, vendors]) => setStats({ products: products.size, vendors: vendors.size }))
      .catch(() => {});
  }, []);

  const items = [
    { icon: Package, value: stats.products || "New", label: "Products online" },
    { icon: Store, value: stats.vendors || "Growing", label: "Seller community" },
    { icon: ShieldCheck, value: "Secure", label: "Checkout experience" },
    { icon: Headphones, value: "Support", label: "When you need help" },
  ];

  return (
    <section className="bg-white pb-10 md:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-5">
        <div className="grid grid-cols-2 lg:grid-cols-4 border-y border-slate-200">
          {items.map(({ icon: Icon, value, label }, index) => (
            <div key={label} className={`py-4 md:py-5 flex items-center gap-3 ${index % 2 === 0 ? "pr-3 border-r border-slate-200" : "pl-3"} ${index > 1 ? "border-t lg:border-t-0" : ""} lg:px-5 lg:border-r lg:last:border-r-0`}>
              <div className="w-9 h-9 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center flex-shrink-0"><Icon size={17} /></div>
              <div className="min-w-0"><p className="text-sm md:text-base font-black truncate">{value}</p><p className="text-[10px] md:text-xs text-gray-500 truncate">{label}</p></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
