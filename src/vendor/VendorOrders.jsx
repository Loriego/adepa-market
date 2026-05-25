import { useEffect, useState } from "react";
import { collection, onSnapshot, query } from "firebase/firestore";
import {
  ShoppingBag,
  Banknote,
  Clock,
  PackageCheck,
  MapPin,
  Phone,
} from "lucide-react";

import { db } from "../firebase/firebaseConfig";
import { useAuth } from "../context/AuthContext";

export default function VendorOrders() {
  const { user } = useAuth();

  const [orders, setOrders] = useState([]);
  const [vendorOrders, setVendorOrders] = useState([]);

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

  useEffect(() => {
    if (!user) return;

    const filtered = orders
      .map((order) => {
        const items = order.items?.filter(
          (item) => item.vendorId === user.uid
        );

        if (!items || items.length === 0) return null;

        const vendorTotal = items.reduce(
          (sum, item) =>
            sum + Number(item.price || 0) * Number(item.quantity || 1),
          0
        );

        return {
          ...order,
          vendorItems: items,
          vendorTotal,
        };
      })
      .filter(Boolean);

    setVendorOrders(filtered);
  }, [orders, user]);

  const totalSales = vendorOrders.reduce(
    (sum, order) => sum + Number(order.vendorTotal || 0),
    0
  );

  const pendingOrders = vendorOrders.filter(
    (order) => order.deliveryStatus !== "Delivered"
  ).length;

  return (
    <div className="w-full overflow-x-hidden">
      <div className="bg-black text-white rounded-[2rem] p-8 mb-8">
        <p className="text-orange-500 font-black">Vendor Sales</p>

        <h1 className="text-4xl md:text-5xl font-black mt-2">
          My Vendor Orders
        </h1>

        <p className="text-white/70 mt-3">
          Track customer orders containing your products.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-3xl p-6 shadow-sm">
          <ShoppingBag className="text-orange-600 mb-3" />
          <p className="text-gray-500 font-bold">Orders</p>
          <h2 className="text-4xl font-black">{vendorOrders.length}</h2>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm">
          <Banknote className="text-green-600 mb-3" />
          <p className="text-gray-500 font-bold">Vendor Sales</p>
          <h2 className="text-4xl font-black">GH₵ {totalSales}</h2>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm">
          <Clock className="text-yellow-600 mb-3" />
          <p className="text-gray-500 font-bold">Pending Deliveries</p>
          <h2 className="text-4xl font-black">{pendingOrders}</h2>
        </div>
      </div>

      {vendorOrders.length === 0 ? (
        <div className="bg-white rounded-[2rem] p-10 text-center">
          <PackageCheck className="mx-auto text-orange-600 mb-4" size={60} />

          <h2 className="text-2xl font-black">No vendor orders yet</h2>

          <p className="text-gray-500 mt-2">
            Orders containing your products will appear here.
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {vendorOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-[2rem] p-6 shadow-sm"
            >
              <div className="flex flex-col lg:flex-row lg:justify-between gap-6 mb-6">
                <div>
                  <h2 className="text-2xl font-black">
                    Order #{order.id.slice(0, 8)}
                  </h2>

                  <p className="text-gray-500 mt-1">
                    Ref: {order.transactionReference || "N/A"}
                  </p>

                  <div className="mt-4 space-y-2 text-gray-600">
                    <p className="flex items-center gap-2">
                      <Phone size={18} />
                      {order.customer?.phone || "No phone"}
                    </p>

                    <p className="flex items-center gap-2">
                      <MapPin size={18} />
                      {order.customer?.city || "No city"} -{" "}
                      {order.customer?.location ||
                        order.customer?.address ||
                        "No location"}
                    </p>
                  </div>
                </div>

                <div className="lg:text-right">
                  <p className="text-3xl font-black text-orange-600">
                    GH₵ {Number(order.vendorTotal || 0).toFixed(2)}
                  </p>

                  <p className="font-bold text-gray-500">
                    {order.deliveryStatus || "Pending"}
                  </p>

                  <p className="font-bold text-gray-500">
                    Payment: {order.paymentStatus || "N/A"}
                  </p>
                </div>
              </div>

              <div className="border-t pt-5">
                <h3 className="font-black mb-4">
                  Your Items in this Order
                </h3>

                <div className="grid gap-3">
                  {order.vendorItems.map((item, index) => (
                    <div
                      key={`${order.id}-${item.id || index}`}
                      className="bg-slate-50 rounded-2xl p-4 flex justify-between gap-4"
                    >
                      <div>
                        <p className="font-black">{item.name}</p>

                        <p className="text-gray-500">
                          Quantity: {item.quantity || 1}
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
}