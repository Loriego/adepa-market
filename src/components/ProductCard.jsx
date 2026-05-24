import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Flame, Heart, Eye, Store } from "lucide-react";

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
        whileHover={{ y: -10, scale: 1.02 }}
        transition={{ type: "spring", stiffness: 220 }}
        className="bg-white rounded-3xl shadow-sm overflow-hidden hover:shadow-2xl transition relative group"
      >
        <div className="absolute top-4 left-4 z-10 flex gap-2 flex-wrap">
          {product.isFlashSale && (
            <span className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-black flex items-center gap-1">
              <Flame size={14} />
              Flash
            </span>
          )}

          {Number(product.discount) > 0 && (
            <span className="bg-black text-white px-3 py-1 rounded-full text-xs font-black">
              -{product.discount}%
            </span>
          )}
        </div>

        <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
          <button
            onClick={() => addToWishlist(product)}
            className="bg-white w-10 h-10 rounded-full flex items-center justify-center shadow hover:bg-red-500 hover:text-white transition"
          >
            <Heart size={18} />
          </button>

          <button
            onClick={() => setQuickOpen(true)}
            className="bg-white w-10 h-10 rounded-full flex items-center justify-center shadow hover:bg-orange-600 hover:text-white transition"
          >
            <Eye size={18} />
          </button>
        </div>

        <Link to={`/product/${product.id}`}>
          <div className="overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="h-72 w-full object-cover group-hover:scale-110 transition duration-700"
            />
          </div>
        </Link>

        <div className="p-6">
          <p className="text-sm text-orange-600 font-bold">
            {product.category}
          </p>

          <Link to={`/product/${product.id}`}>
            <h3 className="text-xl font-black mt-1 hover:text-orange-600 line-clamp-2">
              {product.name}
            </h3>
          </Link>

          {product.vendorId && (
            <Link
              to={`/vendor-store/${product.vendorId}`}
              className="mt-3 inline-flex items-center gap-2 bg-orange-50 text-orange-700 px-3 py-2 rounded-full text-sm font-black hover:bg-orange-600 hover:text-white transition"
            >
              <Store size={16} />
              {product.vendorShopName || "Visit Vendor Shop"}
            </Link>
          )}

          <div className="mt-4">
            <p className="text-3xl font-black">GH₵ {product.price}</p>

            {Number(product.oldPrice) > 0 && (
              <p className="text-gray-400 line-through font-bold">
                GH₵ {product.oldPrice}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 mt-5">
            <button
              onClick={() => addToCart(product)}
              className="bg-black text-white py-3 rounded-xl font-bold hover:bg-orange-600 transition"
            >
              Add Cart
            </button>

            <button
              onClick={() => setQuickOpen(true)}
              className="bg-orange-600 text-white py-3 rounded-xl font-bold hover:bg-black transition"
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