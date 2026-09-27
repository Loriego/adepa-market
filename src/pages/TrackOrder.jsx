import { useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { Search, PackageCheck, Truck, CheckCircle, Clock, ShieldCheck, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { db } from "../firebase/firebaseConfig";

export default function TrackOrder() {
  const [search, setSearch] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const trackOrder = async (e) => {
    e?.preventDefault();
    const value = search.trim();
    if (!value) { toast.error("Enter your payment reference"); return; }

    try {
      setLoading(true);
      setSearched(true);
      const ordersRef = collection(db, "orders");
      const [paymentSnap, transactionSnap] = await Promise.all([
        getDocs(query(ordersRef, where("paymentReference", "==", value))),
        getDocs(query(ordersRef, where("transactionReference", "==", value))),
      ]);

      const map = new Map();
      paymentSnap.forEach((item) => map.set(item.id, { id: item.id, ...item.data() }));
      transactionSnap.forEach((item) => map.set(item.id, { id: item.id, ...item.data() }));
      setOrders([...map.values()]);
    } catch (error) {
      console.log(error);
      toast.error("We could not check that reference. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const steps = ["Processing", "Packed", "Out for Delivery", "Delivered"];
  const isActive = (current, step) => {
    const currentIndex = steps.indexOf(current || "Processing");
    return currentIndex >= 0 && steps.indexOf(step) <= currentIndex;
  };
  const money = (value) => Number(value || 0).toLocaleString("en-GH", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <>
      <Navbar />
      <main className="min-h-[70vh] bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-7 md:py-10">
          <Link to="/account" className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-orange-600 mb-5"><ArrowLeft size={16} /> Account</Link>

          <section className="bg-gray-950 text-white rounded-3xl p-6 md:p-8 relative overflow-hidden">
            <div className="absolute -right-16 -top-16 w-56 h-56 rounded-full bg-orange-600/20 blur-3xl" />
            <div className="relative max-w-xl"><p className="text-[11px] font-extrabold tracking-[0.16em] text-orange-400">ORDER TRACKING</p><h1 className="text-2xl md:text-3xl font-black tracking-tight mt-2">Where is my order?</h1><p className="text-sm text-gray-400 mt-2">Use the payment reference from your order confirmation to see the latest delivery status.</p></div>
            <form onSubmit={trackOrder} className="relative mt-6 flex flex-col sm:flex-row gap-2 max-w-2xl">
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Enter payment reference" className="flex-1 bg-white text-gray-950 rounded-xl px-4 py-3.5 text-sm outline-none focus:ring-2 focus:ring-orange-400" />
              <button disabled={loading} className="bg-orange-600 disabled:bg-orange-400 text-white px-6 py-3.5 rounded-xl text-sm font-extrabold flex items-center justify-center gap-2"><Search size={17} /> {loading ? "Checking..." : "Track order"}</button>
            </form>
            <p className="relative mt-3 text-[11px] text-gray-500 flex items-center gap-1.5"><ShieldCheck size={12} /> For privacy, phone-number-only tracking is disabled.</p>
          </section>

          {!searched ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center mt-5"><PackageCheck size={30} className="mx-auto text-orange-600" /><h2 className="font-black mt-4">Ready when you are</h2><p className="text-sm text-gray-500 mt-1">Your order progress will appear here.</p></div>
          ) : !loading && orders.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center mt-5"><PackageCheck size={30} className="mx-auto text-gray-300" /><h2 className="font-black mt-4">No matching order</h2><p className="text-sm text-gray-500 mt-1">Check the reference exactly as shown on your confirmation.</p></div>
          ) : (
            <div className="space-y-5 mt-5">
              {orders.map((order) => (
                <article key={order.id} className="bg-white border border-slate-200 rounded-2xl p-5 md:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div><p className="text-xs text-gray-400">Order</p><h2 className="font-black mt-1">#{order.id.slice(0, 8).toUpperCase()}</h2><p className="text-xs text-gray-500 mt-1">Ref {order.transactionReference || order.paymentReference}</p></div>
                    <div className="sm:text-right"><span className="inline-flex bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full text-xs font-extrabold">{order.paymentStatus || "Paid"}</span><p className="text-xl font-black mt-2">GH₵ {money(order.total)}</p></div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-6">
                    {steps.map((step) => {
                      const active = isActive(order.deliveryStatus, step);
                      const Icon = step === "Delivered" ? CheckCircle : step === "Out for Delivery" ? Truck : Clock;
                      return <div key={step} className={`rounded-xl p-3 text-center border ${active ? "bg-orange-50 border-orange-200 text-orange-700" : "bg-slate-50 border-slate-100 text-gray-400"}`}><Icon size={18} className="mx-auto" /><p className="text-[11px] sm:text-xs font-extrabold mt-2">{step}</p></div>;
                    })}
                  </div>

                  <div className="mt-6 border-t border-slate-100 pt-5">
                    <p className="text-sm font-extrabold mb-3">Products in this order</p>
                    <div className="space-y-2">
                      {order.items?.map((item, index) => (
                        <div key={`${item.id || item.name}-${index}`} className="flex items-center gap-3 bg-slate-50 rounded-xl p-3">
                          <div className="w-12 h-12 rounded-lg bg-white p-1"><img src={item.image || item.images?.[0]} alt={item.name} className="w-full h-full object-contain" /></div>
                          <div className="min-w-0 flex-1"><p className="text-sm font-bold truncate">{item.name}</p><p className="text-xs text-gray-500">Qty {item.quantity || 1}</p></div>
                          <p className="text-sm font-extrabold whitespace-nowrap">GH₵ {money(Number(item.price || 0) * Number(item.quantity || 1))}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
