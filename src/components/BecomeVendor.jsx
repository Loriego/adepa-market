import { Link } from "react-router-dom";
import { ArrowRight, Store, PackageCheck, BarChart3 } from "lucide-react";

export default function BecomeVendor() {
  return (
    <section className="bg-white py-10 md:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-5">
        <div className="relative overflow-hidden rounded-3xl bg-gray-950 text-white p-6 sm:p-8 md:p-10">
          <div className="absolute -right-20 -top-24 w-72 h-72 bg-orange-600/20 rounded-full blur-3xl" />
          <div className="relative grid lg:grid-cols-[1fr_.75fr] gap-8 items-center">
            <div>
              <p className="text-[10px] tracking-[0.16em] text-orange-400 font-extrabold">SELL ON ADEPA</p>
              <h2 className="text-2xl md:text-3xl font-black tracking-tight mt-2 max-w-xl">Give your products a modern digital storefront.</h2>
              <p className="text-sm text-gray-400 leading-6 mt-3 max-w-xl">Create a seller account, list products and manage your marketplace presence from one place.</p>
              <Link to="/vendor" className="inline-flex items-center gap-2 mt-6 bg-orange-600 hover:bg-orange-500 px-5 py-3 rounded-xl text-sm font-extrabold transition">Start selling <ArrowRight size={16} /></Link>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[ [Store,"Store"], [PackageCheck,"Products"], [BarChart3,"Dashboard"] ].map(([Icon,label]) => <div key={label} className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center"><Icon size={20} className="mx-auto text-orange-400" /><p className="text-[11px] font-bold mt-2 text-gray-300">{label}</p></div>)}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
