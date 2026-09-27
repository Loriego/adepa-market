import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { Package, Store, Users, Headphones } from "lucide-react";
import { db } from "../firebase/firebaseConfig";

export default function MarketplaceStats() {
  const [stats, setStats] = useState({ products: 0, vendors: 0, customers: 0 });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [productsSnap, vendorsSnap, usersSnap] = await Promise.all([
          getDocs(collection(db, "products")),
          getDocs(collection(db, "vendors")),
          getDocs(collection(db, "users")),
        ]);
        setStats({ products: productsSnap.size, vendors: vendorsSnap.size, customers: usersSnap.size });
      } catch (error) {
        console.log(error);
      }
    };
    loadStats();
  }, []);

  const items = [
    { icon: Package, value: `${stats.products}+`, label: "Products to discover" },
    { icon: Store, value: `${stats.vendors}+`, label: "Marketplace vendors" },
    { icon: Users, value: `${stats.customers}+`, label: "Adepa customers" },
    { icon: Headphones, value: "24/7", label: "Shopping support" },
  ];

  return (
    <section className="bg-white pb-12 md:pb-16">
      <div className="max-w-7xl mx-auto px-5">
        <div className="grid grid-cols-2 lg:grid-cols-4 rounded-2xl border border-slate-200 bg-slate-50 overflow-hidden">
          {items.map(({ icon: Icon, value, label }, index) => (
            <div key={label} className={`p-5 md:p-6 flex items-center gap-4 ${index % 2 === 0 ? "border-r border-slate-200" : ""} ${index < 2 ? "border-b lg:border-b-0" : ""} ${index === 1 ? "lg:border-r" : ""}`}>
              <div className="w-10 h-10 rounded-xl bg-white shadow-sm text-orange-600 flex items-center justify-center flex-shrink-0">
                <Icon size={19} />
              </div>
              <div>
                <p className="text-xl md:text-2xl font-black tracking-tight text-gray-950">{value}</p>
                <p className="text-xs md:text-sm text-gray-500 font-semibold">{label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
