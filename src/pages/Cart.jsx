import { Link } from "react-router-dom";
import { motion } from "framer-motion";
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

  return (
    <>
      <Navbar />

      <main className="max-w-7xl mx-auto px-5 py-12">
        <h1 className="text-5xl font-black mb-10">Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 shadow-sm text-center">
            <h2 className="text-2xl font-black mb-6">
              Your cart is empty
            </h2>

            <Link
              to="/shop"
              className="bg-orange-600 text-white px-8 py-4 rounded-full font-black"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-6">
              {cartItems.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white rounded-3xl p-5 flex flex-col md:flex-row gap-5 shadow-sm"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full md:w-32 h-52 md:h-32 rounded-2xl object-cover"
                  />

                  <div className="flex-1">
                    <h2 className="text-2xl font-black">{item.name}</h2>

                    <p className="text-orange-600 font-bold mt-1">
                      {item.category}
                    </p>

                    <p className="text-3xl font-black mt-4">
                      GH₵ {item.price}
                    </p>

                    <div className="flex items-center gap-3 mt-5">
                      <button
                        onClick={() => decreaseQuantity(item.id)}
                        className="bg-black text-white w-10 h-10 rounded-full font-black"
                      >
                        -
                      </button>

                      <span className="font-black text-xl">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() => increaseQuantity(item.id)}
                        className="bg-orange-600 text-white w-10 h-10 rounded-full font-black"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-500 font-bold self-start"
                  >
                    Remove
                  </button>
                </motion.div>
              ))}
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-sm h-fit">
              <h2 className="text-3xl font-black mb-8">Order Summary</h2>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>GH₵ {totalPrice}</span>
                </div>

                <div className="flex justify-between">
                  <span>Delivery</span>
                  <span>GH₵ {deliveryFee}</span>
                </div>

                <hr />

                <div className="flex justify-between text-2xl font-black">
                  <span>Total</span>
                  <span>GH₵ {finalTotal}</span>
                </div>
              </div>

              <Link
                to="/checkout"
                className="block text-center w-full bg-orange-600 text-white py-4 rounded-full font-black mt-8"
              >
                Proceed to Checkout
              </Link>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}