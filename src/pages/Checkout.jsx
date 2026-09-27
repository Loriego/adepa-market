import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ShoppingBag, Truck, ShieldCheck, LockKeyhole, ArrowLeft, BadgeCheck } from "lucide-react";
import toast from "react-hot-toast";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PayButton from "../components/PaystackButton";
import { useCart } from "../context/CartContext";
import { db } from "../firebase/firebaseConfig";

export default function Checkout() {
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState({ name: "", email: "", phone: "", city: "", address: "" });

  const subtotal = useMemo(() => cartItems.reduce((acc, item) => acc + Number(item.price || 0) * Number(item.quantity || 1), 0), [cartItems]);
  const shipping = subtotal > 0 ? 40 : 0;
  const grandTotal = subtotal + shipping;
  const isComplete = Object.values(customer).every((value) => String(value).trim().length > 0) && customer.email.includes("@");

  const money = (value) => Number(value || 0).toLocaleString("en-GH", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const handleChange = (e) => setCustomer((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const placeOrder = async (reference) => {
    const order = {
      customer,
      items: cartItems,
      subtotal,
      deliveryFee: shipping,
      total: grandTotal,
      paymentReference: reference.reference,
      transactionReference: reference.trxref || reference.reference,
      paymentStatus: "Paid",
      deliveryStatus: "Processing",
      vendorPayoutStatus: "Unpaid",
      createdAt: serverTimestamp(),
    };

    const orderRef = await addDoc(collection(db, "orders"), order);
    const savedOrder = { ...order, id: orderRef.id, createdAt: new Date().toISOString() };
    localStorage.setItem("lastOrder", JSON.stringify(savedOrder));
    return savedOrder;
  };

  if (cartItems.length === 0) {
    return (
      <>
        <Navbar />
        <main className="min-h-[70vh] bg-slate-50 flex items-center justify-center px-5">
          <div className="max-w-md w-full bg-white border border-slate-200 rounded-3xl p-9 text-center">
            <div className="w-14 h-14 rounded-2xl bg-orange-50 text-orange-600 mx-auto flex items-center justify-center"><ShoppingBag size={25} /></div>
            <h1 className="text-2xl font-black mt-5">Your cart is empty</h1>
            <p className="text-gray-500 text-sm mt-2">Add products before starting checkout.</p>
            <Link to="/shop" className="inline-flex mt-6 bg-orange-600 text-white px-6 py-3 rounded-xl text-sm font-extrabold">Go shopping</Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const fieldClass = "w-full border border-slate-200 bg-white rounded-xl px-4 py-3.5 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition";

  return (
    <>
      <Navbar />
      <main className="bg-slate-50 min-h-screen">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-7 md:py-10">
          <Link to="/cart" className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-orange-600 mb-5"><ArrowLeft size={16} /> Back to cart</Link>

          <div className="mb-6">
            <p className="text-xs font-extrabold tracking-[0.14em] text-orange-600">SECURE CHECKOUT</p>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight mt-1">Complete your order</h1>
            <p className="text-sm text-gray-500 mt-1">Enter your delivery details, review your order, then pay securely.</p>
          </div>

          <div className="grid lg:grid-cols-[1fr_360px] gap-6 items-start">
            <section className="bg-white rounded-2xl p-5 md:p-6 border border-slate-200">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center font-black text-sm">1</div>
                <div><h2 className="font-black">Delivery information</h2><p className="text-xs text-gray-500">Where should we send your order?</p></div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <label className="text-xs font-bold text-gray-600">Full name<input type="text" name="name" autoComplete="name" placeholder="Your full name" value={customer.name} onChange={handleChange} className={`${fieldClass} mt-1.5`} /></label>
                <label className="text-xs font-bold text-gray-600">Email address<input type="email" name="email" autoComplete="email" placeholder="you@example.com" value={customer.email} onChange={handleChange} className={`${fieldClass} mt-1.5`} /></label>
                <label className="text-xs font-bold text-gray-600">Phone number<input type="tel" name="phone" autoComplete="tel" placeholder="e.g. 024 000 0000" value={customer.phone} onChange={handleChange} className={`${fieldClass} mt-1.5`} /></label>
                <label className="text-xs font-bold text-gray-600">City / town<input type="text" name="city" autoComplete="address-level2" placeholder="e.g. Accra" value={customer.city} onChange={handleChange} className={`${fieldClass} mt-1.5`} /></label>
              </div>

              <label className="block text-xs font-bold text-gray-600 mt-4">Delivery address<textarea name="address" autoComplete="street-address" placeholder="House number, street, area or landmark" value={customer.address} onChange={handleChange} rows="4" className={`${fieldClass} mt-1.5 resize-none`} /></label>

              <div className="grid sm:grid-cols-3 gap-3 mt-6 pt-6 border-t border-slate-100">
                <div className="flex gap-2.5"><Truck size={18} className="text-orange-600 flex-shrink-0" /><div><p className="text-xs font-extrabold">Delivery</p><p className="text-[11px] text-gray-500">Across Ghana</p></div></div>
                <div className="flex gap-2.5"><ShieldCheck size={18} className="text-orange-600 flex-shrink-0" /><div><p className="text-xs font-extrabold">Protected</p><p className="text-[11px] text-gray-500">Secure checkout</p></div></div>
                <div className="flex gap-2.5"><BadgeCheck size={18} className="text-orange-600 flex-shrink-0" /><div><p className="text-xs font-extrabold">Marketplace</p><p className="text-[11px] text-gray-500">Trusted sellers</p></div></div>
              </div>
            </section>

            <aside className="bg-gray-950 text-white rounded-2xl p-5 lg:sticky lg:top-24 shadow-xl shadow-slate-900/10">
              <div className="flex items-center justify-between"><h2 className="text-lg font-black">Order summary</h2><span className="text-xs text-gray-400">{cartItems.length} items</span></div>

              <div className="space-y-4 mt-5 max-h-[300px] overflow-y-auto pr-1">
                {cartItems.map((item, index) => (
                  <div key={`${item.id || item.name}-${index}`} className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-xl bg-white p-1.5 flex-shrink-0"><img src={item.image || item.images?.[0]} alt={item.name} className="w-full h-full object-contain" /></div>
                    <div className="min-w-0 flex-1"><p className="text-sm font-bold truncate">{item.name}</p><p className="text-xs text-gray-400 mt-0.5">Qty {item.quantity || 1}</p></div>
                    <p className="text-sm font-extrabold whitespace-nowrap">GH₵ {money(Number(item.price || 0) * Number(item.quantity || 1))}</p>
                  </div>
                ))}
              </div>

              <div className="mt-5 pt-5 border-t border-white/10 space-y-3 text-sm">
                <div className="flex justify-between text-gray-400"><span>Subtotal</span><span className="text-white font-bold">GH₵ {money(subtotal)}</span></div>
                <div className="flex justify-between text-gray-400"><span>Delivery</span><span className="text-white font-bold">GH₵ {money(shipping)}</span></div>
                <div className="flex justify-between text-lg font-black border-t border-white/10 pt-4"><span>Total</span><span className="text-orange-400">GH₵ {money(grandTotal)}</span></div>
              </div>

              {!isComplete && <p className="mt-4 rounded-xl bg-white/5 p-3 text-xs text-gray-300">Complete all delivery fields with a valid email to unlock payment.</p>}

              <PayButton
                email={customer.email || "customer@adepamarket.com"}
                amount={grandTotal}
                disabled={!isComplete}
                metadata={{ custom_fields: [
                  { display_name: "Customer Name", variable_name: "customer_name", value: customer.name || "Customer" },
                  { display_name: "Phone", variable_name: "phone", value: customer.phone || "N/A" },
                ]}}
                onSuccess={async (reference) => {
                  try {
                    const savedOrder = await placeOrder(reference);
                    clearCart();
                    toast.success("Payment successful. Order confirmed!");
                    navigate("/order-success", { state: { order: savedOrder }, replace: true });
                  } catch (error) {
                    console.error(error);
                    toast.error("Payment succeeded, but we could not save the order. Please contact support.");
                  }
                }}
              />

              <p className="flex items-center justify-center gap-1.5 text-center text-gray-500 text-[11px] mt-4"><LockKeyhole size={12} /> Secure payment powered by Paystack</p>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
