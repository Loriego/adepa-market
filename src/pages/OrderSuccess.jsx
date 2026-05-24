import { Link, useLocation } from "react-router-dom";
import { CheckCircle, ShoppingBag, Truck } from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function OrderSuccess() {
  const location = useLocation();
  const order = location.state?.order;

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-slate-100 px-5 py-12 flex items-center justify-center">
        <div className="bg-white max-w-3xl w-full rounded-[2rem] p-8 md:p-12 shadow-xl text-center">
          <CheckCircle className="mx-auto text-green-600 mb-6" size={80} />

          <p className="text-orange-600 font-black">Payment Successful</p>

          <h1 className="text-4xl md:text-5xl font-black mt-3">
            Order Placed Successfully
          </h1>

          <p className="text-gray-500 mt-5">
            Thank you for shopping with Adepa Market. Your order has been
            received.
          </p>

          {order && (
            <div className="bg-slate-50 rounded-3xl p-6 mt-8 text-left">
              <h2 className="text-2xl font-black mb-5">Order Summary</h2>

              <div className="space-y-3">
                <p><strong>Customer:</strong> {order.customer?.name}</p>
                <p><strong>Phone:</strong> {order.customer?.phone}</p>
                <p><strong>City:</strong> {order.customer?.city}</p>
                <p><strong>Address:</strong> {order.customer?.location}</p>
                <p><strong>Total Paid:</strong> GH₵ {order.total}</p>
                <p><strong>Payment:</strong> {order.paymentStatus}</p>
                <p><strong>Delivery:</strong> {order.deliveryStatus}</p>
                <p><strong>Reference:</strong> {order.transactionReference}</p>
              </div>
            </div>
          )}

          <div className="grid sm:grid-cols-2 gap-4 mt-8">
            <Link
              to="/shop"
              className="bg-orange-600 text-white py-4 rounded-full font-black flex items-center justify-center gap-2"
            >
              <ShoppingBag size={20} />
              Continue Shopping
            </Link>

            <Link
              to="/account"
              className="bg-black text-white py-4 rounded-full font-black flex items-center justify-center gap-2"
            >
              <Truck size={20} />
              Track My Orders
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}