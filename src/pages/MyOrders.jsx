import { useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { Link } from "react-router-dom";
import { ShoppingBag, MapPin, CreditCard, PackageSearch, ArrowRight, CalendarDays } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import OrderTimeline from "../components/OrderTimeline";
import { db } from "../firebase/firebaseConfig";
import { useAuth } from "../context/AuthContext";

export default function MyOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    const q = query(collection(db, "orders"), where("customer.email", "==", user.email));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
      list.sort((a, b) => {
        const aTime = a.createdAt?.seconds || Date.parse(a.createdAt || 0) / 1000 || 0;
        const bTime = b.createdAt?.seconds || Date.parse(b.createdAt || 0) / 1000 || 0;
        return bTime - aTime;
      });
      setOrders(list);
      setLoading(false);
    }, () => setLoading(false));
    return () => unsubscribe();
  }, [user]);

  const money = (value) => Number(value || 0).toLocaleString("en-GH", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const dateText = (value) => {
    if (!value) return "Recent order";
    const date = value?.toDate ? value.toDate() : new Date(value);
    return Number.isNaN(date.getTime()) ? "Recent order" : date.toLocaleDateString("en-GH", { day: "numeric", month: "short", year: "numeric" });
  };

  return (
    <>
      <Navbar />
      <main className="min-h-[70vh] bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-7 md:py-10">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
            <div><p className="text-xs font-extrabold tracking-[0.14em] text-orange-600">PURCHASE HISTORY</p><h1 className="text-2xl md:text-3xl font-black tracking-tight mt-1">My orders</h1><p className="text-sm text-gray-500 mt-1">Follow your purchases from payment to delivery.</p></div>
            <Link to="/track-order" className="inline-flex items-center justify-center gap-2 border border-slate-200 bg-white px-4 py-2.5 rounded-xl text-sm font-extrabold hover:border-orange-200 hover:text-orange-600"><PackageSearch size={16} /> Track by reference</Link>
          </div>

          {!user ? (
            <div className="bg-white border border-slate-200 rounded-3xl p-10 text-center"><ShoppingBag size={28} className="mx-auto text-orange-600" /><h2 className="text-xl font-black mt-4">Sign in to see your orders</h2><p className="text-sm text-gray-500 mt-2">Your purchase history is linked to your account email.</p><Link to="/login" className="inline-flex mt-5 bg-orange-600 text-white px-6 py-3 rounded-xl text-sm font-extrabold">Login</Link></div>
          ) : loading ? (
            <div className="space-y-4 animate-pulse">{[1,2].map((i) => <div key={i} className="h-52 bg-white border border-slate-200 rounded-2xl" />)}</div>
          ) : orders.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-3xl p-10 md:p-14 text-center"><div className="w-14 h-14 rounded-2xl bg-orange-50 text-orange-600 mx-auto flex items-center justify-center"><ShoppingBag size={24} /></div><h2 className="text-xl font-black mt-5">No orders yet</h2><p className="text-sm text-gray-500 mt-2">Your completed purchases will appear here.</p><Link to="/shop" className="inline-flex items-center gap-2 mt-6 bg-orange-600 text-white px-6 py-3 rounded-xl text-sm font-extrabold">Start shopping <ArrowRight size={16} /></Link></div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <article key={order.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                  <div className="p-5 md:p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-100">
                    <div><div className="flex items-center gap-2 flex-wrap"><h2 className="font-black">Order #{order.id.slice(0, 8).toUpperCase()}</h2><span className="bg-orange-50 text-orange-700 px-2.5 py-1 rounded-full text-[11px] font-extrabold">{order.deliveryStatus || "Processing"}</span></div><p className="text-xs text-gray-500 mt-2 flex items-center gap-1.5"><CalendarDays size={13} /> {dateText(order.createdAt)} · Ref {order.transactionReference || order.paymentReference || "N/A"}</p></div>
                    <div className="md:text-right"><p className="text-xs text-gray-400">Order total</p><p className="text-xl font-black mt-0.5">GH₵ {money(order.total)}</p></div>
                  </div>

                  <div className="p-5 md:p-6">
                    <OrderTimeline status={order.deliveryStatus || "Processing"} />
                    <div className="grid md:grid-cols-2 gap-3 mt-5">
                      <div className="bg-slate-50 rounded-xl p-4"><h3 className="text-sm font-extrabold flex items-center gap-2"><MapPin size={16} className="text-orange-600" /> Delivery</h3><p className="text-sm mt-2">{order.customer?.city || "—"}</p><p className="text-xs text-gray-500 mt-1">{order.customer?.address || order.customer?.location || "Address not available"}</p><p className="text-xs text-gray-500 mt-1">{order.customer?.phone || "—"}</p></div>
                      <div className="bg-slate-50 rounded-xl p-4"><h3 className="text-sm font-extrabold flex items-center gap-2"><CreditCard size={16} className="text-orange-600" /> Payment</h3><div className="grid grid-cols-2 gap-2 mt-2 text-xs"><span className="text-gray-500">Status</span><span className="text-right font-bold text-emerald-600">{order.paymentStatus || "Paid"}</span><span className="text-gray-500">Subtotal</span><span className="text-right font-bold">GH₵ {money(order.subtotal)}</span><span className="text-gray-500">Delivery</span><span className="text-right font-bold">GH₵ {money(order.deliveryFee)}</span></div></div>
                    </div>

                    <div className="mt-5">
                      <p className="text-sm font-extrabold mb-3">Items</p>
                      <div className="space-y-2">
                        {order.items?.map((item, index) => (
                          <div key={`${item.id || item.name}-${index}`} className="flex items-center gap-3 border border-slate-100 rounded-xl p-3">
                            <div className="w-12 h-12 bg-slate-50 rounded-lg p-1 flex-shrink-0"><img src={item.image || item.images?.[0]} alt={item.name} className="w-full h-full object-contain" /></div>
                            <div className="min-w-0 flex-1"><p className="text-sm font-bold truncate">{item.name}</p><p className="text-xs text-gray-500">Qty {item.quantity || 1}</p></div>
                            <p className="text-sm font-extrabold whitespace-nowrap">GH₵ {money(Number(item.price || 0) * Number(item.quantity || 1))}</p>
                          </div>
                        ))}
                      </div>
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
