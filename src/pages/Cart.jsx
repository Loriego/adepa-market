import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingBag, Trash2, Minus, Plus, ArrowRight, ShieldCheck, Truck, RotateCcw } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useCart } from "../context/CartContext";

export default function Cart() {
  const { cartItems, increaseQuantity, decreaseQuantity, removeItem, totalPrice } = useCart();
  const deliveryFee = cartItems.length ? 40 : 0;
  const finalTotal = totalPrice + deliveryFee;

  const money = (value) => Number(value || 0).toLocaleString("en-GH", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <>
      <Navbar />
      <main className="min-h-[70vh] bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-7 md:py-10">
          <div className="flex items-end justify-between gap-4 mb-6">
            <div>
              <p className="text-xs font-extrabold tracking-[0.14em] text-orange-600">YOUR BAG</p>
              <h1 className="text-2xl md:text-3xl font-black tracking-tight mt-1">Shopping cart</h1>
              <p className="text-sm text-gray-500 mt-1">{cartItems.length} {cartItems.length === 1 ? "product" : "products"} ready for checkout</p>
            </div>
            {cartItems.length > 0 && <Link to="/shop" className="hidden sm:flex text-sm font-bold text-gray-600 hover:text-orange-600">Continue shopping →</Link>}
          </div>

          {cartItems.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 md:p-14 border border-slate-200 text-center">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center"><ShoppingBag size={25} /></div>
              <h2 className="text-xl font-black mt-5">Your cart is waiting</h2>
              <p className="text-gray-500 text-sm mt-2 max-w-sm mx-auto">Browse the marketplace and add something you love.</p>
              <Link to="/shop" className="inline-flex mt-6 bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-xl text-sm font-extrabold transition">Explore products</Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-[1fr_330px] gap-6 items-start">
              <div className="space-y-3">
                {cartItems.map((item) => (
                  <motion.article key={item.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-4 border border-slate-200">
                    <div className="flex gap-4">
                      <Link to={`/product/${item.id}`} className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-slate-50 flex-shrink-0 overflow-hidden p-2">
                        <img src={item.image || item.images?.[0]} alt={item.name} className="w-full h-full object-contain" />
                      </Link>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-[11px] uppercase tracking-wide text-orange-600 font-extrabold">{item.category || "Product"}</p>
                            <Link to={`/product/${item.id}`} className="block text-sm sm:text-base font-extrabold mt-1 truncate hover:text-orange-600">{item.name}</Link>
                            <p className="text-lg font-black mt-2">GH₵ {money(item.price)}</p>
                          </div>
                          <button onClick={() => removeItem(item.id)} className="w-9 h-9 flex-shrink-0 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-600 flex items-center justify-center transition" aria-label="Remove item"><Trash2 size={17} /></button>
                        </div>

                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center rounded-lg border border-slate-200 overflow-hidden">
                            <button onClick={() => decreaseQuantity(item.id)} className="w-9 h-9 flex items-center justify-center hover:bg-slate-50" aria-label="Decrease quantity"><Minus size={14} /></button>
                            <span className="w-9 text-center text-sm font-black">{item.quantity}</span>
                            <button onClick={() => increaseQuantity(item.id)} className="w-9 h-9 flex items-center justify-center hover:bg-slate-50" aria-label="Increase quantity"><Plus size={14} /></button>
                          </div>
                          <p className="text-sm font-extrabold text-gray-700">GH₵ {money(Number(item.price) * Number(item.quantity))}</p>
                        </div>
                      </div>
                    </div>
                  </motion.article>
                ))}

                <div className="grid sm:grid-cols-2 gap-3 pt-2">
                  <div className="bg-white border border-slate-200 rounded-xl p-4 flex gap-3"><ShieldCheck size={20} className="text-orange-600 flex-shrink-0" /><div><p className="text-sm font-extrabold">Secure checkout</p><p className="text-xs text-gray-500 mt-0.5">Protected payment experience</p></div></div>
                  <div className="bg-white border border-slate-200 rounded-xl p-4 flex gap-3"><Truck size={20} className="text-orange-600 flex-shrink-0" /><div><p className="text-sm font-extrabold">Delivery across Ghana</p><p className="text-xs text-gray-500 mt-0.5">Delivery details confirmed at checkout</p></div></div>
                </div>
              </div>

              <aside className="bg-white rounded-2xl p-5 border border-slate-200 lg:sticky lg:top-24">
                <h2 className="text-lg font-black">Order summary</h2>
                <div className="mt-5 space-y-3 text-sm">
                  <div className="flex justify-between text-gray-600"><span>Subtotal</span><span className="font-bold text-gray-900">GH₵ {money(totalPrice)}</span></div>
                  <div className="flex justify-between text-gray-600"><span>Delivery</span><span className="font-bold text-gray-900">GH₵ {money(deliveryFee)}</span></div>
                </div>
                <div className="flex justify-between gap-4 text-lg font-black border-t border-slate-200 pt-4 mt-4"><span>Total</span><span>GH₵ {money(finalTotal)}</span></div>
                <Link to="/checkout" className="mt-5 w-full bg-orange-600 hover:bg-orange-700 text-white py-3.5 rounded-xl text-sm font-extrabold flex items-center justify-center gap-2 transition">
                  Secure checkout <ArrowRight size={17} />
                </Link>
                <p className="text-center text-[11px] text-gray-400 mt-3">Taxes and delivery shown before payment.</p>
                <Link to="/shop" className="mt-4 flex items-center justify-center gap-2 text-xs font-bold text-gray-500 hover:text-orange-600"><RotateCcw size={14} /> Keep shopping</Link>
              </aside>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
