import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-black text-white min-h-[90vh] flex items-center">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b"
          alt=""
          className="w-full h-full object-cover opacity-40"
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent"></div>

      <div className="max-w-7xl mx-auto px-5 relative z-10 grid lg:grid-cols-2 gap-10 items-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <motion.p
            initial={{ opacity: 0, x: -25 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="text-orange-500 font-black text-xl mb-4"
          >
            ADEPA MARKET
          </motion.p>

          <h1 className="text-5xl md:text-7xl font-black leading-tight">
            Ghana’s Premium
            <span className="text-orange-500"> Online Marketplace</span>
          </h1>

          <p className="mt-8 text-lg text-gray-300 leading-8 max-w-xl">
            Shop trending fashion, gadgets, sneakers, luxury accessories and
            viral products delivered across Ghana.
          </p>

          <div className="flex flex-wrap gap-5 mt-10">
            <Link
              to="/shop"
              className="bg-orange-600 hover:bg-orange-700 transition px-8 py-5 rounded-full font-black text-lg active:scale-95 shadow-xl"
            >
              Shop Now
            </Link>

            <Link
              to="/shop"
              className="border border-white px-8 py-5 rounded-full font-black text-lg hover:bg-white hover:text-black transition active:scale-95"
            >
              Explore Deals
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotate: -8 }}
          animate={{ opacity: 1, scale: 1, rotate: -5 }}
          transition={{ duration: 1 }}
          className="hidden lg:flex justify-center"
        >
          <img
            src="https://images.unsplash.com/photo-1542291026-7eec264c27ff"
            alt=""
            className="w-[500px] rounded-[3rem] shadow-2xl"
          />
        </motion.div>
      </div>
    </section>
  );
}