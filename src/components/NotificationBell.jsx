import { useEffect, useState } from "react";
import { Bell, CheckCircle, Package, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  limit,
} from "firebase/firestore";

import { db } from "../firebase/firebaseConfig";

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const q = query(
      collection(db, "orders"),
      orderBy("createdAt", "desc"),
      limit(5)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const alerts = snapshot.docs.map((doc) => {
        const order = doc.data();

        return {
          id: doc.id,
          title: "New Order",
          message: `${order.customer?.name || "Customer"} placed an order worth GH₵ ${
            order.total || 0
          }`,
          status: order.deliveryStatus || "Pending",
        };
      });

      setNotifications(alerts);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative bg-slate-100 w-11 h-11 rounded-full flex items-center justify-center"
      >
        <Bell size={20} />

        {notifications.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-black">
            {notifications.length}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            className="absolute right-0 mt-4 w-80 bg-white rounded-3xl shadow-2xl p-5 z-[100]"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-black text-xl">Live Alerts</h3>

              <button onClick={() => setOpen(false)}>
                <X size={20} />
              </button>
            </div>

            {notifications.length === 0 ? (
              <p className="text-gray-500">No alerts yet.</p>
            ) : (
              <div className="grid gap-3 max-h-96 overflow-y-auto">
                {notifications.map((item) => (
                  <div key={item.id} className="bg-slate-50 rounded-2xl p-4">
                    <div className="flex gap-3">
                      <div className="bg-orange-100 text-orange-600 w-10 h-10 rounded-full flex items-center justify-center shrink-0">
                        {item.status === "Delivered" ? (
                          <CheckCircle size={20} />
                        ) : (
                          <Package size={20} />
                        )}
                      </div>

                      <div>
                        <p className="font-black">{item.title}</p>

                        <p className="text-sm text-gray-500">
                          {item.message}
                        </p>

                        <span className="inline-block mt-2 bg-black text-white text-xs px-3 py-1 rounded-full font-bold">
                          {item.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}