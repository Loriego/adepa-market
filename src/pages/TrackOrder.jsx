import { useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import {
  Search,
  PackageCheck,
  Truck,
  CheckCircle,
  Clock,
} from "lucide-react";

import { db } from "../firebase/firebaseConfig";

export default function TrackOrder() {
  const [search, setSearch] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const trackOrder = async () => {
    if (!search.trim()) {
      alert("Enter phone number or payment reference");
      return;
    }

    try {
      setLoading(true);

      const ordersRef = collection(db, "orders");

      const phoneQuery = query(
        ordersRef,
        where("customer.phone", "==", search.trim())
      );

      const refQuery = query(
        ordersRef,
        where("paymentReference", "==", search.trim())
      );

      const phoneSnap = await getDocs(phoneQuery);
      const refSnap = await getDocs(refQuery);

      const results = [];

      phoneSnap.forEach((doc) => {
        results.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      refSnap.forEach((doc) => {
        const exists = results.find((item) => item.id === doc.id);

        if (!exists) {
          results.push({
            id: doc.id,
            ...doc.data(),
          });
        }
      });

      setOrders(results);
    } catch (error) {
      console.log(error);
      alert("Failed to track order");
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    "Processing",
    "Packed",
    "Out for Delivery",
    "Delivered",
  ];

  const isActive = (current, step) => {
    return steps.indexOf(step) <= steps.indexOf(current || "Processing");
  };

  return (
    <main className="min-h-screen bg-slate-100 px-5 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="bg-black text-white rounded-[2rem] p-8 mb-8">
          <p className="text-orange-500 font-black">ADEPA MARKET</p>

          <h1 className="text-5xl font-black mt-2">
            Track Your Order
          </h1>

          <p className="text-gray-400 mt-4">
            Enter your phone number or payment reference
          </p>
        </div>

        <div className="bg-white rounded-[2rem] p-5 shadow-lg flex flex-col md:flex-row gap-4 mb-10">
          <input
            type="text"
            placeholder="Phone number or payment reference"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 border border-gray-200 rounded-2xl p-5 outline-none"
          />

          <button
            onClick={trackOrder}
            className="bg-orange-600 text-white px-8 rounded-2xl font-black flex items-center justify-center gap-2"
          >
            <Search size={20} />
            {loading ? "Searching..." : "Track"}
          </button>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-[2rem] p-16 text-center">
            <PackageCheck
              size={70}
              className="mx-auto text-orange-600 mb-5"
            />

            <h2 className="text-3xl font-black">
              No Orders Found
            </h2>

            <p className="text-gray-500 mt-3">
              Search with your phone number or payment reference
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-[2rem] p-8 shadow-lg"
              >
                <div className="flex flex-col md:flex-row justify-between gap-6 mb-8">
                  <div>
                    <h2 className="text-3xl font-black">
                      Order #{order.id.slice(0, 8)}
                    </h2>

                    <p className="text-gray-500 mt-2">
                      Ref: {order.paymentReference}
                    </p>

                    <p className="text-gray-500">
                      Phone: {order.customer?.phone}
                    </p>
                  </div>

                  <div className="md:text-right">
                    <h2 className="text-4xl font-black text-orange-600">
                      GH₵ {order.total}
                    </h2>

                    <p className="text-green-600 font-black mt-2">
                      {order.paymentStatus}
                    </p>

                    <p className="text-blue-600 font-black">
                      {order.deliveryStatus || "Processing"}
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-4 gap-4 mb-8">
                  {steps.map((step) => {
                    const active = isActive(
                      order.deliveryStatus,
                      step
                    );

                    return (
                      <div
                        key={step}
                        className={`rounded-2xl p-5 text-center ${
                          active
                            ? "bg-orange-600 text-white"
                            : "bg-slate-100 text-gray-400"
                        }`}
                      >
                        {step === "Delivered" ? (
                          <CheckCircle className="mx-auto mb-3" />
                        ) : step === "Out for Delivery" ? (
                          <Truck className="mx-auto mb-3" />
                        ) : (
                          <Clock className="mx-auto mb-3" />
                        )}

                        <p className="font-black">{step}</p>
                      </div>
                    );
                  })}
                </div>

                <div>
                  <h3 className="text-2xl font-black mb-5">
                    Ordered Products
                  </h3>

                  <div className="space-y-4">
                    {order.items?.map((item, index) => (
                      <div
                        key={index}
                        className="bg-slate-100 rounded-2xl p-5 flex justify-between items-center"
                      >
                        <div className="flex items-center gap-4">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-20 h-20 rounded-xl object-cover"
                          />

                          <div>
                            <h3 className="font-black">
                              {item.name}
                            </h3>

                            <p className="text-gray-500">
                              Qty: {item.quantity || 1}
                            </p>
                          </div>
                        </div>

                        <h3 className="font-black text-xl">
                          GH₵{" "}
                          {(
                            Number(item.price || 0) *
                            Number(item.quantity || 1)
                          ).toFixed(2)}
                        </h3>
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
  );
}