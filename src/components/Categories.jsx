import { Link } from "react-router-dom";
import {
  Smartphone,
  Shirt,
  Gamepad2,
  Watch,
  Headphones,
  Home,
  Laptop,
  ShoppingBag,
  ArrowUpRight,
} from "lucide-react";

const categories = [
  { name: "Phones", icon: Smartphone },
  { name: "Fashion", icon: Shirt },
  { name: "Gaming", icon: Gamepad2 },
  { name: "Watches", icon: Watch },
  { name: "Audio", icon: Headphones },
  { name: "Home", icon: Home },
  { name: "Computers", icon: Laptop },
  { name: "Accessories", icon: ShoppingBag },
];

export default function Categories() {
  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-5">
        <div className="flex items-end justify-between gap-5 mb-7">
          <div>
            <p className="text-xs font-extrabold tracking-[0.14em] text-orange-600">EXPLORE ADEPA</p>
            <h2 className="mt-2 text-2xl md:text-3xl font-black tracking-tight text-gray-950">Shop by category</h2>
          </div>
          <Link to="/shop" className="hidden sm:flex items-center gap-1.5 text-sm font-bold text-gray-600 hover:text-orange-600 transition">
            View all <ArrowUpRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {categories.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                to="/shop"
                key={item.name}
                className="group bg-slate-50 border border-slate-100 hover:border-orange-200 hover:bg-white hover:-translate-y-1 hover:shadow-[0_14px_35px_rgba(15,23,42,0.08)] transition-all duration-300 rounded-2xl px-3 py-5 text-center"
              >
                <div className="w-11 h-11 mx-auto rounded-xl bg-white text-gray-700 shadow-sm flex items-center justify-center group-hover:bg-orange-600 group-hover:text-white transition duration-300">
                  <Icon size={21} />
                </div>
                <h3 className="mt-3 text-sm font-extrabold text-gray-800">{item.name}</h3>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
