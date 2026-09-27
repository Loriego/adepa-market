import { Link, useLocation } from "react-router-dom";
import { Check, ShoppingBag, Truck, ReceiptText, ArrowRight } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function OrderSuccess() {
  const location = useLocation();
  let order = location.state?.order;

  if (!order) {
    try {
      order = JSON.parse(localStorage.getItem("lastOrder") || "null");
    } catch {
      order = null;
    }
  }

  const money = (value) => Number(value || 0).toLocaleString("en-GH", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <>
      <Navbar />
      <main className="min-h-[72vh] bg-slate-50 px-4 py-8 md:py-12">
        <div className="max-w-2xl mx-auto bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
          <div className="p-7 md:p-10 text-center border-b border-slate-100">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center"><Check size={30} strokeWidth={3} /></div>
            <p className="text-xs font-extrabold tracking-[0.14em] text-emerald-600 mt-5">PAYMENT CONFIRMED</p>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight mt-2">Your order is confirmed</h1>
            <p className="text-sm text-gray-500 mt-3 max-w-md mx-auto">Thank you for shopping with Adepa Market. We have received your order and it is now being prepared.</p>
          </div>

          {order && (
            <div className="p-6 md:p-8">
              <div className="flex items-center gap-2 mb-5"><ReceiptText size={18} className="text-orange-600" /><h2 className="font-black">Order details</h2></div>
              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                <div><p className="text-xs text-gray-400">Customer</p><p className="font-bold mt-1">{order.customer?.name || "Customer"}</p></div>
                <div><p className="text-xs text-gray-400">Phone</p><p className="font-bold mt-1">{order.customer?.phone || "—"}</p></div>
                <div><p className="text-xs text-gray-400">Delivery city</p><p className="font-bold mt-1">{order.customer?.city || "—"}</p></div>
                <div><p className="text-xs text-gray-400">Delivery address</p><p className="font-bold mt-1">{order.customer?.address || "—"}</p></div>
                <div><p className="text-xs text-gray-400">Payment</p><p className="font-bold mt-1 text-emerald-600">{order.paymentStatus || "Paid"}</p></div>
                <div><p className="text-xs text-gray-400">Order total</p><p className="font-black mt-1">GH₵ {money(order.total)}</p></div>
              </div>
              {order.transactionReference && <div className="mt-5 bg-slate-50 rounded-xl p-4"><p className="text-[11px] text-gray-400">Payment reference</p><p className="text-xs sm:text-sm font-mono font-bold mt-1 break-all">{order.transactionReference}</p></div>}
            </div>
          )}

          <div className="px-6 md:px-8 pb-7 md:pb-8 grid sm:grid-cols-2 gap-3">
            <Link to="/shop" className="bg-orange-600 hover:bg-orange-700 text-white py-3.5 rounded-xl text-sm font-extrabold flex items-center justify-center gap-2 transition"><ShoppingBag size={17} /> Continue shopping</Link>
            <Link to="/my-orders" className="bg-gray-950 hover:bg-gray-800 text-white py-3.5 rounded-xl text-sm font-extrabold flex items-center justify-center gap-2 transition"><Truck size={17} /> Track my orders <ArrowRight size={15} /></Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
