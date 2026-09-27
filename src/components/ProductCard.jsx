import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Flame, Heart, Eye, Store, Crown, ShoppingBag } from "lucide-react";

import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import ProductQuickView from "./ProductQuickView";

export default function ProductCard({ product }) {
  const [quickOpen, setQuickOpen] = useState(false);
  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();

  const money = (value) =>
    Number(value || 0).toLocaleString("en-GH", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });

  return (
    <>
      <motion.article
        whileHover={{ y: -4 }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
        className="bg-white border border-slate-100 rounded-2xl overflow-hidden hover:border-orange-100 hover:shadow-[0_18px_45px_rgba(15,23,42,0.09)] transition-shadow duration-300 relative group w-full"
      >
        <div className="absolute top-3 left-3 z-10 flex gap-1.5 flex-wrap">
          {product.sponsored && (
            <span className="bg-amber-400/95 text-black px-2.5 py-1 rounded-full text-[10px] font-extrabold flex items-center gap-1 shadow-sm">
              <Crown size={11} /> Sponsored
            </span>
          )}
          {product.isFlashSale && (
            <span className="bg-red-600 text-white px-2.5 py-1 rounded-full text-[10px] font-extrabold flex items-center gap-1 shadow-sm">
              <Flame size={11} /> Flash
            </span>
          )}
          {Number(product.discount) > 0 && (
            <span className="bg-gray-950 text-white px-2.5 py-1 rounded-full text-[10px] font-extrabold">
              -{product.discount}%
            </span>
          )}
        </div>

        <div className="absolute top-3 right-3 z-10 flex flex-col gap-2 opacity-100 sm:opacity-0 sm:translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition duration-300">
          <button onClick={() => addToWishlist(product)} aria-label="Add to wishlist" className="bg-white/95 w-9 h-9 rounded-full flex items-center justify-center border border-slate-100 shadow-sm hover:bg-red-500 hover:text-white transition">
            <Heart size={16} />
          </button>
          <button onClick={() => setQuickOpen(true)} aria-label="Quick view" className="bg-white/95 w-9 h-9 rounded-full flex items-center justify-center border border-slate-100 shadow-sm hover:bg-orange-600 hover:text-white transition">
            <Eye size={16} />
          </button>
        </div>

        <Link to={`/product/${product.id}`} className="block">
          <div className="bg-gradient-to-b from-slate-50 to-white h-44 sm:h-52 flex items-center justify-center overflow-hidden p-5">
            <img
              src={product.image || product.images?.[0]}
              alt={product.name}
              loading="lazy"
              className="max-h-full max-w-full object-contain group-hover:scale-[1.04] transition-transform duration-500 ease-out"
            />
          </div>
        </Link>

        <div className="p-3.5 sm:p-4">
          <p className="text-[11px] uppercase tracking-wide text-orange-600 font-extrabold">{product.category || "Product"}</p>

          <Link to={`/product/${product.id}`}>
            <h3 className="text-sm sm:text-base font-extrabold mt-1.5 text-gray-900 hover:text-orange-600 line-clamp-2 min-h-[42px] leading-snug transition">
              {product.name}
            </h3>
          </Link>

          {product.vendorId && (
            <Link to={`/vendor-store/${product.vendorId}`} className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-bold text-gray-500 hover:text-orange-600 transition max-w-full">
              <Store size={12} />
              <span className="truncate">{product.vendorShopName || "Vendor Shop"}</span>
            </Link>
          )}

          <div className="mt-3 flex items-end gap-2 flex-wrap">
            <p className="text-lg sm:text-xl font-black tracking-tight text-gray-950">GH₵ {money(product.price)}</p>
            {Number(product.oldPrice) > 0 && (
              <p className="text-gray-400 line-through font-semibold text-xs pb-0.5">GH₵ {money(product.oldPrice)}</p>
            )}
          </div>

          <div className="grid grid-cols-[1fr_auto] gap-2 mt-4">
            <button onClick={() => addToCart(product)} className="bg-gray-950 text-white py-2.5 px-3 rounded-xl text-xs sm:text-sm font-extrabold hover:bg-orange-600 transition flex items-center justify-center gap-2">
              <ShoppingBag size={15} /> Add to cart
            </button>
            <button onClick={() => setQuickOpen(true)} aria-label="Quick view" className="w-10 rounded-xl border border-slate-200 text-gray-600 hover:border-orange-200 hover:bg-orange-50 hover:text-orange-600 transition flex items-center justify-center">
              <Eye size={16} />
            </button>
          </div>
        </div>
      </motion.article>

      <ProductQuickView product={product} open={quickOpen} onClose={() => setQuickOpen(false)} />
    </>
  );
}
