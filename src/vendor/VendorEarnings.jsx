import { useEffect, useState } from "react";
import { collection, onSnapshot, query } from "firebase/firestore";
import { Banknote, Wallet, Percent, Clock, ShoppingBag } from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { db } from "../firebase/firebaseConfig";
import { useAuth } from "../context/AuthContext";

export default function VendorEarnings() {
  const { user } = useAuth();

  const commissionRate = 0.1;

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "orders"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const orderList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setOrders(orderList);
    });

    return () => unsubscribe();
  }, []);

  const vendorSales = orders
    .map((order) => {
      const vendorItems = order.items?.filter(
        (item) => item.vendorId === user?.uid
      );

      if (!vendorItems || vendorItems.length === 0) return null;

      const gross = vendorItems.reduce(
        (sum, item) =>
          sum + Number(item.price || 0) * Number(item.quantity || 1),
        0
      );

      const commission = gross * commissionRate;
      const net = gross - commission;

      return {
        ...order,
        vendorItems,
        gross,
        commission,
        net,
      };
    })
    .filter(Boolean);

  const paidOrders = vendorSales.filter(
    (order) => order.vendorPayoutStatus === "Paid"
  );

  const unpaidOrders = vendorSales.filter(
    (order) => order.vendorPayoutStatus !== "Paid"
  );

  const grossSales = vendorSales.reduce(
    (sum, order) => sum + Number(order.gross || 0),
    0
  );

  const commissionTotal = vendorSales.reduce(
    (sum, order) => sum + Number(order.commission || 0),
    0
  );

  const vendorEarnings = vendorSales.reduce(
    (sum, order) => sum + Number(order.net || 0),
    0
  );

  const unpaidBalance = unpaidOrders.reduce(
    (sum, order) => sum + Number(order.net || 0),
    0
  );

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-slate-100 px-5 py-10">
        <div className="max-w-7xl mx-auto">
          <div className="bg-black text-white rounded-[2rem] p-8 mb-8">
            <p className="text-orange-500 font-black">Vendor Finance</p>

            <h1 className="text-4xl md:text-5xl font-black mt-2">
              My Earnings
            </h1>

            <p className="text-white/70 mt-3">
              Track your sales, commission and payout balance.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-3xl p-6 shadow-sm">
              <Banknote className="text-green-600 mb-3" />
              <p className="text-gray-500 font-bold">Gross Sales</p>
              <h2 className="text-3xl font-black">
                GH₵ {grossSales.toFixed(2)}
              </h2>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-sm">
              <Percent className="text-orange-600 mb-3" />
              <p className="text-gray-500 font-bold">Adepa Commission</p>
              <h2 className="text-3xl font-black">
                GH₵ {commissionTotal.toFixed(2)}
              </h2>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-sm">
              <Wallet className="text-blue-600 mb-3" />
              <p className="text-gray-500 font-bold">Vendor Earnings</p>
              <h2 className="text-3xl font-black">
                GH₵ {vendorEarnings.toFixed(2)}
              </h2>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-sm">
              <Clock className="text-yellow-600 mb-3" />
              <p className="text-gray-500 font-bold">Unpaid Balance</p>
              <h2 className="text-3xl font-black">
                GH₵ {unpaidBalance.toFixed(2)}
              </h2>
            </div>
          </div>

          {vendorSales.length === 0 ? (
            <div className="bg-white rounded-[2rem] p-10 text-center">
              <ShoppingBag className="mx-auto text-orange-600 mb-4" size={60} />

              <h2 className="text-2xl font-black">No earnings yet</h2>

              <p className="text-gray-500 mt-2">
                Your earnings will appear here when customers buy your products.
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-[2rem] p-6 shadow-sm">
              <h2 className="text-3xl font-black mb-6">Sales Breakdown</h2>

              <div className="grid gap-5">
                {vendorSales.map((order) => (
                  <div
                    key={order.id}
                    className="border rounded-3xl p-5"
                  >
                    <div className="flex flex-col md:flex-row md:justify-between gap-4 mb-5">
                      <div>
                        <h3 className="font-black text-xl">
                          Order #{order.id.slice(0, 8)}
                        </h3>

                        <p className="text-gray-500">
                          Payment: {order.paymentStatus}
                        </p>

                        <p className="text-gray-500">
                          Payout: {order.vendorPayoutStatus || "Unpaid"}
                        </p>
                      </div>

                      <div className="md:text-right">
                        <p className="font-black">
                          Gross: GH₵ {order.gross.toFixed(2)}
                        </p>

                        <p className="text-orange-600 font-black">
                          Commission: GH₵ {order.commission.toFixed(2)}
                        </p>

                        <p className="text-green-600 font-black">
                          You Earn: GH₵ {order.net.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <div className="grid gap-3">
                      {order.vendorItems.map((item) => (
                        <div
                          key={item.id}
                          className="bg-slate-50 rounded-2xl p-4 flex justify-between gap-4"
                        >
                          <div>
                            <p className="font-black">{item.name}</p>
                            <p className="text-gray-500">
                              Quantity: {item.quantity}
                            </p>
                          </div>

                          <p className="font-black">
                            GH₵{" "}
                            {(
                              Number(item.price || 0) *
                              Number(item.quantity || 1)
                            ).toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}