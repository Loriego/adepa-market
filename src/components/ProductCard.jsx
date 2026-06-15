import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Flame, Heart, Eye, Store, Crown } from "lucide-react";

import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import ProductQuickView from "./ProductQuickView";

export default function ProductCard({ product }) {
  const [quickOpen, setQuickOpen] = useState(false);

  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();

  return (
    <>
      <motion.div
        whileHover={{ y: -5 }}
        transition={{ type: "spring", stiffness: 220 }}
        className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-xl transition relative group w-full"
      >
        <div className="absolute top-3 left-3 z-10 flex gap-2 flex-wrap">
          {product.sponsored && (
            <span className="bg-yellow-500 text-black px-2.5 py-1 rounded-full text-[11px] font-black flex items-center gap-1">
              <Crown size={12} />
              Sponsored
            </span>
          )}

          {product.isFlashSale && (
            <span className="bg-red-600 text-white px-2.5 py-1 rounded-full text-[11px] font-black flex items-center gap-1">
              <Flame size={12} />
              Flash
            </span>
          )}

          {Number(product.discount) > 0 && (
            <span className="bg-black text-white px-2.5 py-1 rounded-full text-[11px] font-black">
              -{product.discount}%
            </span>
          )}
        </div>

        <div className="absolute top-3 right-3 z-10 flex flex-col gap-2">
          <button
            onClick={() => addToWishlist(product)}
            className="bg-white w-9 h-9 rounded-full flex items-center justify-center shadow hover:bg-red-500 hover:text-white transition"
          >
            <Heart size={16} />
          </button>

          <button
            onClick={() => setQuickOpen(true)}
            className="bg-white w-9 h-9 rounded-full flex items-center justify-center shadow hover:bg-orange-600 hover:text-white transition"
          >
            <Eye size={16} />
          </button>
        </div>

        <Link to={`/product/${product.id}`}>
          <div className="bg-white h-48 flex items-center justify-center overflow-hidden p-4">
            <img
              src={product.image || product.images?.[0]}
              alt={product.name}
              className="max-h-full max-w-full object-contain group-hover:scale-105 transition duration-500"
            />
          </div>
        </Link>

        <div className="p-4">
          <p className="text-xs text-orange-600 font-bold">
            {product.category}
          </p>

          <Link to={`/product/${product.id}`}>
            <h3 className="text-base font-black mt-1 hover:text-orange-600 line-clamp-2 min-h-[48px]">
              {product.name}
            </h3>
          </Link>

          {product.vendorId && (
            <Link
              to={`/vendor-store/${product.vendorId}`}
              className="mt-2 inline-flex items-center gap-1 bg-orange-50 text-orange-700 px-3 py-1.5 rounded-full text-xs font-black hover:bg-orange-600 hover:text-white transition max-w-full"
            >
              <Store size={13} />
              <span className="truncate">
                {product.vendorShopName || "Vendor Shop"}
              </span>
            </Link>
          )}

          <div className="mt-3">
            <p className="text-2xl font-black">GH₵ {product.price}</p>

            {Number(product.oldPrice) > 0 && (
              <p className="text-gray-400 line-through font-bold text-sm">
                GH₵ {product.oldPrice}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 mt-4">
            <button
              onClick={() => addToCart(product)}
              className="bg-black text-white py-2.5 rounded-xl text-sm font-bold hover:bg-orange-600 transition"
            >
              Add Cart
            </button>

            <button
              onClick={() => setQuickOpen(true)}
              className="bg-orange-600 text-white py-2.5 rounded-xl text-sm font-bold hover:bg-black transition"
            >
              Quick View
            </button>
          </div>
        </div>
      </motion.div>

      <ProductQuickView
        product={product}
        open={quickOpen}
        onClose={() => setQuickOpen(false)}
      />
    </>
  );
}