import { Link } from "react-router-dom";
import { X, ShoppingCart, Heart, Eye, Zap, Store } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

export default function ProductQuickView({ product, open, onClose }) {
  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();

  if (!product) return null;

  const productImages =
    product.images?.length > 0 ? product.images : [product.image];

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />

          <motion.div
            initial={{ opacity: 0, y: 80, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 80, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 220, damping: 24 }}
            className="fixed inset-x-4 top-[5%] md:top-[8%] mx-auto max-w-5xl bg-white rounded-[2rem] shadow-2xl z-[110] overflow-hidden max-h-[90vh] overflow-y-auto"
          >
            <button
              onClick={onClose}
              className="absolute right-5 top-5 bg-black text-white w-11 h-11 rounded-full flex items-center justify-center z-20"
            >
              <X size={22} />
            </button>

            <div className="grid lg:grid-cols-2">
              <div className="bg-slate-100 p-5">
                <img
                  src={productImages[0]}
                  alt={product.name}
                  className="w-full h-[420px] object-cover rounded-[1.5rem]"
                />

                {productImages.length > 1 && (
                  <div className="grid grid-cols-4 gap-3 mt-4">
                    {productImages.slice(0, 4).map((img, index) => (
                      <img
                        key={index}
                        src={img}
                        alt="Product"
                        className="h-24 w-full object-cover rounded-2xl border"
                      />
                    ))}
                  </div>
                )}
              </div>

              <div className="p-8">
                <div className="flex gap-2 flex-wrap mb-5">
                  <span className="bg-orange-100 text-orange-700 px-4 py-2 rounded-full font-black text-sm">
                    {product.category}
                  </span>

                  {product.isFlashSale && (
                    <span className="bg-red-600 text-white px-4 py-2 rounded-full font-black text-sm">
                      Flash Sale
                    </span>
                  )}

                  {Number(product.discount) > 0 && (
                    <span className="bg-black text-white px-4 py-2 rounded-full font-black text-sm">
                      -{product.discount}% OFF
                    </span>
                  )}
                </div>

                <h2 className="text-4xl md:text-5xl font-black leading-tight">
                  {product.name}
                </h2>

                {product.vendorId && (
                  <div className="mt-5 bg-orange-50 rounded-3xl p-5">
                    <p className="text-gray-500 font-bold">Sold by</p>

                    <Link
                      to={`/vendor-store/${product.vendorId}`}
                      onClick={onClose}
                      className="mt-2 inline-flex items-center gap-2 text-orange-700 font-black hover:text-black"
                    >
                      <Store size={20} />
                      {product.vendorShopName || "Vendor Shop"}
                    </Link>
                  </div>
                )}

                <div className="mt-6">
                  <p className="text-4xl font-black text-orange-600">
                    GH₵ {product.price}
                  </p>

                  {Number(product.oldPrice) > 0 && (
                    <p className="text-gray-400 line-through font-bold text-xl mt-2">
                      GH₵ {product.oldPrice}
                    </p>
                  )}
                </div>

                <p className="text-gray-600 leading-8 mt-6 line-clamp-4">
                  {product.description}
                </p>

                <div className="grid sm:grid-cols-2 gap-4 mt-8">
                  <button
                    onClick={() => addToCart(product)}
                    className="bg-black text-white py-4 rounded-full font-black flex items-center justify-center gap-2 active:scale-95 transition"
                  >
                    <ShoppingCart size={20} />
                    Add to Cart
                  </button>

                  <button
                    onClick={() => addToWishlist(product)}
                    className="bg-red-500 text-white py-4 rounded-full font-black flex items-center justify-center gap-2 active:scale-95 transition"
                  >
                    <Heart size={20} />
                    Wishlist
                  </button>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 mt-4">
                  <Link
                    to="/checkout"
                    onClick={() => addToCart(product)}
                    className="bg-orange-600 text-white py-4 rounded-full font-black flex items-center justify-center gap-2 active:scale-95 transition"
                  >
                    <Zap size={20} />
                    Buy Now
                  </Link>

                  <Link
                    to={`/product/${product.id}`}
                    onClick={onClose}
                    className="bg-slate-100 text-black py-4 rounded-full font-black flex items-center justify-center gap-2 active:scale-95 transition"
                  >
                    <Eye size={20} />
                    Full Details
                  </Link>
                </div>

                {product.vendorId && (
                  <Link
                    to={`/vendor-store/${product.vendorId}`}
                    onClick={onClose}
                    className="mt-4 w-full bg-green-600 text-white py-4 rounded-full font-black flex items-center justify-center gap-2"
                  >
                    <Store size={20} />
                    Visit Vendor Shop
                  </Link>
                )}

                <div className="mt-8 bg-orange-50 rounded-3xl p-5">
                  <p className="font-black">Stock Status</p>
                  <p className="text-gray-600">{product.stock || "In Stock"}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}