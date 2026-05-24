import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import toast from "react-hot-toast";
import {
  PackageCheck,
  Truck,
  XCircle,
  Clock,
  Phone,
  MapPin,
  CreditCard,
  Trash2,
} from "lucide-react";

import { db } from "../firebase/firebaseConfig";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const orderList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setOrders(orderList);
    });

    return () => unsubscribe();
  }, []);

  const updateDeliveryStatus = async (id, status) => {
    try {
      await updateDoc(doc(db, "orders", id), {
        deliveryStatus: status,
      });

      toast.success(`Order marked as ${status}`);
    } catch (error) {
      console.log(error);
      toast.error("Failed to update order");
    }
  };

  const updatePaymentStatus = async (id, status) => {
    try {
      await updateDoc(doc(db, "orders", id), {
        paymentStatus: status,
      });

      toast.success(`Payment marked as ${status}`);
    } catch (error) {
      console.log(error);
      toast.error("Failed to update payment");
    }
  };

  const deleteOrder = async (id) => {
    const confirmDelete = confirm("Delete this order permanently?");

    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "orders", id));
      toast.success("Order deleted");
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete order");
    }
  };

  const filteredOrders =
    filter === "All"
      ? orders
      : orders.filter((order) => order.deliveryStatus === filter);

  const getStatusStyle = (status) => {
    if (status === "Delivered") return "bg-green-100 text-green-700";
    if (status === "Cancelled") return "bg-red-100 text-red-700";
    if (status === "Out for Delivery") return "bg-blue-100 text-blue-700";
    if (status === "Processing") return "bg-yellow-100 text-yellow-700";
    return "bg-gray-100 text-gray-700";
  };

  const totalSales = orders
    .filter((order) => order.paymentStatus === "Paid")
    .reduce((sum, order) => sum + Number(order.total || 0), 0);

  const pendingOrders = orders.filter(
    (order) => order.deliveryStatus !== "Delivered"
  ).length;

  return (
    <main className="min-h-screen bg-slate-100 px-5 py-10">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <p className="text-orange-600 font-black">Adepa Market Admin</p>

          <h1 className="text-4xl md:text-5xl font-black">
            Live Order Management
          </h1>
        </div>

        <div className="grid sm:grid-cols-3 gap-5 mb-8">
          <div className="bg-white rounded-3xl p-6 shadow-sm">
            <p className="text-gray-500 font-bold">Total Orders</p>
            <h2 className="text-4xl font-black mt-2">{orders.length}</h2>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm">
            <p className="text-gray-500 font-bold">Pending Orders</p>
            <h2 className="text-4xl font-black mt-2">{pendingOrders}</h2>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm">
            <p className="text-gray-500 font-bold">Paid Sales</p>
            <h2 className="text-4xl font-black mt-2">GH₵ {totalSales}</h2>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 shadow-sm mb-8 flex gap-3 flex-wrap">
          {["All", "Pending", "Processing", "Out for Delivery", "Delivered", "Cancelled"].map(
            (item) => (
              <button
                key={item}
                onClick={() => setFilter(item)}
                className={`px-5 py-3 rounded-full font-black ${
                  filter === item
                    ? "bg-orange-600 text-white"
                    : "bg-slate-100 text-black"
                }`}
              >
                {item}
              </button>
            )
          )}
        </div>

        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center">
            <p className="text-gray-500 font-bold">No orders found.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-[2rem] p-6 shadow-sm"
              >
                <div className="flex flex-col lg:flex-row lg:justify-between gap-6">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <Clock className="text-orange-600" />

                      <h2 className="text-2xl font-black">
                        {order.customer?.name || "Customer"}
                      </h2>
                    </div>

                    <div className="space-y-2 text-gray-600">
                      <p className="flex items-center gap-2">
                        <Phone size={18} />
                        {order.customer?.phone}
                      </p>

                      <p className="flex items-center gap-2">
                        <MapPin size={18} />
                        {order.customer?.city || order.deliveryCity} -{" "}
                        {order.customer?.location}
                      </p>

                      <p className="flex items-center gap-2">
                        <CreditCard size={18} />
                        Payment: {order.paymentStatus}
                      </p>
                    </div>
                  </div>

                  <div className="lg:text-right">
                    <p className="text-3xl font-black">GH₵ {order.total}</p>

                    <span
                      className={`inline-block mt-3 px-4 py-2 rounded-full font-black ${getStatusStyle(
                        order.deliveryStatus
                      )}`}
                    >
                      {order.deliveryStatus || "Pending"}
                    </span>
                  </div>
                </div>

                <div className="mt-6 border-t pt-5">
                  <h3 className="font-black mb-4">Ordered Items</h3>

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

                <div className="mt-6 grid md:grid-cols-2 gap-4">
                  <div className="bg-slate-50 rounded-2xl p-4">
                    <h3 className="font-black mb-3">Payment</h3>

                    <div className="flex gap-3 flex-wrap">
                      <button
                        onClick={() => updatePaymentStatus(order.id, "Paid")}
                        className="bg-green-600 text-white px-4 py-2 rounded-full font-bold"
                      >
                        Mark Paid
                      </button>

                      <button
                        onClick={() => updatePaymentStatus(order.id, "Pending")}
                        className="bg-yellow-500 text-white px-4 py-2 rounded-full font-bold"
                      >
                        Mark Pending
                      </button>
                    </div>

                    {order.transactionReference && (
                      <p className="text-sm text-gray-500 mt-3">
                        Ref: {order.transactionReference}
                      </p>
                    )}
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-4">
                    <h3 className="font-black mb-3">Delivery Status</h3>

                    <div className="flex gap-3 flex-wrap">
                      <button
                        onClick={() =>
                          updateDeliveryStatus(order.id, "Processing")
                        }
                        className="bg-yellow-500 text-white px-4 py-2 rounded-full font-bold flex items-center gap-2"
                      >
                        <PackageCheck size={16} />
                        Processing
                      </button>

                      <button
                        onClick={() =>
                          updateDeliveryStatus(order.id, "Out for Delivery")
                        }
                        className="bg-blue-600 text-white px-4 py-2 rounded-full font-bold flex items-center gap-2"
                      >
                        <Truck size={16} />
                        Out
                      </button>

                      <button
                        onClick={() =>
                          updateDeliveryStatus(order.id, "Delivered")
                        }
                        className="bg-green-600 text-white px-4 py-2 rounded-full font-bold"
                      >
                        Delivered
                      </button>

                      <button
                        onClick={() =>
                          updateDeliveryStatus(order.id, "Cancelled")
                        }
                        className="bg-red-600 text-white px-4 py-2 rounded-full font-bold flex items-center gap-2"
                      >
                        <XCircle size={16} />
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex justify-end">
                  <button
                    onClick={() => deleteOrder(order.id)}
                    className="bg-black text-white px-5 py-3 rounded-full font-black flex items-center gap-2"
                  >
                    <Trash2 size={18} />
                    Delete Order
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}