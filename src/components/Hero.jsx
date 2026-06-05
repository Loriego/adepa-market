import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingBag, Store, Truck, ShieldCheck } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-black text-white min-h-[88vh] flex items-center">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b"
          alt=""
          className="w-full h-full object-cover opacity-35"
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/20" />

      <div className="max-w-7xl mx-auto px-5 relative z-10 grid lg:grid-cols-2 gap-10 items-center">
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-orange-500 font-black text-lg mb-4 tracking-wide">
            ADEPA MARKET
          </p>

          <h1 className="text-5xl md:text-7xl font-black leading-tight">
            Ghana’s Premium
            <span className="text-orange-500"> Online Marketplace</span>
          </h1>

          <p className="mt-7 text-lg text-gray-300 leading-8 max-w-xl">
            Shop fashion, gadgets, sneakers, accessories and viral products from
            trusted vendors across Ghana.
          </p>

          <div className="flex flex-wrap gap-4 mt-9">
            <Link
              to="/shop"
              className="bg-orange-600 hover:bg-orange-700 transition px-8 py-5 rounded-full font-black text-lg shadow-xl flex items-center gap-2"
            >
              <ShoppingBag size={22} />
              Shop Now
            </Link>

            <Link
              to="/vendor"
              className="border border-white px-8 py-5 rounded-full font-black text-lg hover:bg-white hover:text-black transition flex items-center gap-2"
            >
              <Store size={22} />
              Sell on Adepa
            </Link>
          </div>

          <div className="grid sm:grid-cols-3 gap-4 mt-10 max-w-2xl">
            <div className="bg-white/10 backdrop-blur rounded-3xl p-5">
              <Truck className="text-orange-500 mb-2" />
              <h3 className="font-black">Fast Delivery</h3>
              <p className="text-white/60 text-sm">Across Ghana</p>
            </div>

            <div className="bg-white/10 backdrop-blur rounded-3xl p-5">
              <ShieldCheck className="text-orange-500 mb-2" />
              <h3 className="font-black">Secure</h3>
              <p className="text-white/60 text-sm">Trusted vendors</p>
            </div>

            <div className="bg-white/10 backdrop-blur rounded-3xl p-5">
              <ShoppingBag className="text-orange-500 mb-2" />
              <h3 className="font-black">Premium</h3>
              <p className="text-white/60 text-sm">Best deals</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.85, rotate: -5 }}
          animate={{ opacity: 1, scale: 1, rotate: -3 }}
          transition={{ duration: 0.8 }}
          className="hidden lg:flex justify-center"
        >
          <div className="bg-white/10 backdrop-blur rounded-[3rem] p-5 shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1542291026-7eec264c27ff"
              alt=""
              className="w-[480px] h-[520px] object-cover rounded-[2.5rem]"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}