import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingBag, Trash2, Minus, Plus } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useCart } from "../context/CartContext";

export default function Cart() {
  const {
    cartItems,
    increaseQuantity,
    decreaseQuantity,
    removeItem,
    totalPrice,
  } = useCart();

  const deliveryFee = 40;
  const finalTotal = totalPrice + deliveryFee;

  const money = (value) =>
    Number(value || 0).toLocaleString("en-GH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  return (
    <>
      <Navbar />

      <main className="min-h-[70vh] bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 md:py-9">
          <div className="flex items-center gap-3 mb-5 md:mb-7">
            <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
              <ShoppingBag size={20} />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black tracking-tight">
                Shopping Cart
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {cartItems.length} {cartItems.length === 1 ? "item" : "items"} in your cart
              </p>
            </div>
          </div>

          {cartItems.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 md:p-10 border border-gray-100 shadow-sm text-center">
              <h2 className="text-xl md:text-2xl font-black mb-3">
                Your cart is empty
              </h2>
              <p className="text-gray-500 text-sm md:text-base mb-6">
                Add products you love and they will appear here.
              </p>
              <Link
                to="/shop"
                className="inline-flex bg-orange-600 hover:bg-orange-700 text-white px-7 py-3 rounded-xl text-sm font-black transition"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-[1fr_320px] gap-5 lg:gap-6 items-start">
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm"
                  >
                    <div className="flex gap-4 sm:gap-5">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-slate-50 flex-shrink-0 overflow-hidden p-2">
                        <img
                          src={item.image || item.images?.[0]}
                          alt={item.name}
                          className="w-full h-full object-contain"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <h2 className="text-base sm:text-lg font-black leading-snug truncate">
                              {item.name}
                            </h2>
                            <p className="text-orange-600 text-sm font-bold mt-1">
                              {item.category}
                            </p>
                          </div>

                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-gray-400 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 transition flex-shrink-0"
                            aria-label={`Remove ${item.name} from cart`}
                          >
                            <Trash2 size={19} />
                          </button>
                        </div>

                        <p className="text-lg sm:text-xl font-black mt-2">
                          GH₵ {money(item.price)}
                        </p>

                        <div className="flex items-center gap-2 mt-3">
                          <button
                            onClick={() => decreaseQuantity(item.id)}
                            className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-black hover:text-white transition"
                            aria-label="Decrease quantity"
                          >
                            <Minus size={16} />
                          </button>

                          <span className="w-6 text-center font-black text-base">
                            {item.quantity}
                          </span>

                          <button
                            onClick={() => increaseQuantity(item.id)}
                            className="w-8 h-8 rounded-lg bg-orange-600 text-white flex items-center justify-center hover:bg-orange-700 transition"
                            aria-label="Increase quantity"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <aside className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm lg:sticky lg:top-24">
                <h2 className="text-lg md:text-xl font-black mb-5">
                  Order Summary
                </h2>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between gap-4 text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-bold text-gray-900">
                      GH₵ {money(totalPrice)}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4 text-gray-600">
                    <span>Delivery</span>
                    <span className="font-bold text-gray-900">
                      GH₵ {money(deliveryFee)}
                    </span>
                  </div>

                  <hr className="border-gray-200" />

                  <div className="flex justify-between gap-4 text-base md:text-lg font-black">
                    <span>Total</span>
                    <span>GH₵ {money(finalTotal)}</span>
                  </div>
                </div>

                <Link
                  to="/checkout"
                  className="block text-center w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-xl text-sm font-black mt-5 transition"
                >
                  Proceed to Checkout
                </Link>

                <Link
                  to="/shop"
                  className="block text-center text-sm font-bold text-gray-600 hover:text-orange-600 mt-4 transition"
                >
                  Continue Shopping
                </Link>
              </aside>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
