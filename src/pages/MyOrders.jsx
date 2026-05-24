import { useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { Link } from "react-router-dom";
import { ShoppingBag, MapPin, CreditCard } from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import OrderTimeline from "../components/OrderTimeline";

import { db } from "../firebase/firebaseConfig";
import { useAuth } from "../context/AuthContext";

export default function MyOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "orders"),
      where("customer.email", "==", user.email)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const orderList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setOrders(orderList);
    });

    return () => unsubscribe();
  }, [user]);

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-slate-100 px-5 py-10">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <p className="text-orange-600 font-black">Customer Dashboard</p>
            <h1 className="text-4xl md:text-5xl font-black">My Orders</h1>
          </div>

          {orders.length === 0 ? (
            <div className="bg-white rounded-[2rem] p-10 text-center">
              <ShoppingBag className="mx-auto text-orange-600 mb-4" size={50} />

              <h2 className="text-2xl font-black mb-3">No orders yet</h2>

              <p className="text-gray-500 mb-6">
                Your orders will appear here after checkout.
              </p>

              <Link
                to="/shop"
                className="bg-orange-600 text-white px-8 py-4 rounded-full font-black"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="grid gap-8">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-[2rem] p-6 shadow-sm"
                >
                  <div className="flex flex-col md:flex-row md:justify-between gap-5 mb-6">
                    <div>
                      <h2 className="text-2xl font-black">
                        Order #{order.id.slice(0, 8)}
                      </h2>

                      <p className="text-gray-500 mt-1">
                        Reference: {order.transactionReference || "N/A"}
                      </p>
                    </div>

                    <div className="md:text-right">
                      <p className="text-3xl font-black text-orange-600">
                        GH₵ {order.total}
                      </p>

                      <p className="font-bold text-gray-500">
                        {order.deliveryStatus || "Pending"}
                      </p>
                    </div>
                  </div>

                  <OrderTimeline status={order.deliveryStatus || "Pending"} />

                  <div className="grid md:grid-cols-2 gap-5 mt-6">
                    <div className="bg-slate-50 rounded-2xl p-5">
                      <h3 className="font-black mb-3 flex items-center gap-2">
                        <MapPin size={18} />
                        Delivery Details
                      </h3>

                      <p>{order.customer?.city}</p>
                      <p className="text-gray-500">
                        {order.customer?.location}
                      </p>
                      <p className="text-gray-500">{order.customer?.phone}</p>
                    </div>

                    <div className="bg-slate-50 rounded-2xl p-5">
                      <h3 className="font-black mb-3 flex items-center gap-2">
                        <CreditCard size={18} />
                        Payment Details
                      </h3>

                      <p>Status: {order.paymentStatus}</p>
                      <p>Subtotal: GH₵ {order.subtotal}</p>
                      <p>Delivery: GH₵ {order.deliveryFee}</p>

                      {Number(order.discount) > 0 && (
                        <p>Discount: GH₵ {order.discount}</p>
                      )}

                      {order.coupon && <p>Coupon: {order.coupon}</p>}
                    </div>
                  </div>

                  <div className="mt-6 border-t pt-5">
                    <h3 className="font-black mb-4">Items Ordered</h3>

                    <div className="grid gap-3">
                      {order.items?.map((item) => (
                        <div
                          key={item.id}
                          className="flex justify-between gap-4 bg-slate-50 rounded-2xl p-4"
                        >
                          <div>
                            <p className="font-black">{item.name}</p>
                            <p className="text-gray-500">
                              Quantity: {item.quantity}
                            </p>
                          </div>

                          <p className="font-black">
                            GH₵ {item.price * item.quantity}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}