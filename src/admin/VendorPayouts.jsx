import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  query,
  updateDoc,
  doc,
} from "firebase/firestore";
import toast from "react-hot-toast";
import { Banknote, Wallet, Percent, CheckCircle, Clock } from "lucide-react";

import { db } from "../firebase/firebaseConfig";

export default function VendorPayouts() {
  const commissionRate = 0.1;

  const [orders, setOrders] = useState([]);
  const [vendorGroups, setVendorGroups] = useState([]);

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
    const groups = {};

    orders.forEach((order) => {
      order.items?.forEach((item) => {
        if (!item.vendorId) return;

        const vendorId = item.vendorId;

        if (!groups[vendorId]) {
          groups[vendorId] = {
            vendorId,
            vendorShopName: item.vendorShopName || item.vendorName || "Vendor",
            vendorEmail: item.vendorEmail || "",
            orders: [],
            gross: 0,
            commission: 0,
            net: 0,
            unpaid: 0,
            paid: 0,
          };
        }

        const itemTotal =
          Number(item.price || 0) * Number(item.quantity || 1);

        const commission = itemTotal * commissionRate;
        const net = itemTotal - commission;

        groups[vendorId].gross += itemTotal;
        groups[vendorId].commission += commission;
        groups[vendorId].net += net;

        if (order.vendorPayoutStatus === "Paid") {
          groups[vendorId].paid += net;
        } else {
          groups[vendorId].unpaid += net;
        }

        groups[vendorId].orders.push({
          orderId: order.id,
          item,
          itemTotal,
          commission,
          net,
          payoutStatus: order.vendorPayoutStatus || "Unpaid",
        });
      });
    });

    setVendorGroups(Object.values(groups));
  }, [orders]);

  const markOrderPaid = async (orderId) => {
    try {
      await updateDoc(doc(db, "orders", orderId), {
        vendorPayoutStatus: "Paid",
      });

      toast.success("Vendor payout marked as paid");
    } catch (error) {
      console.log(error);
      toast.error("Failed to update payout");
    }
  };

  const markOrderUnpaid = async (orderId) => {
    try {
      await updateDoc(doc(db, "orders", orderId), {
        vendorPayoutStatus: "Unpaid",
      });

      toast.success("Vendor payout marked unpaid");
    } catch (error) {
      console.log(error);
      toast.error("Failed to update payout");
    }
  };

  const totalGross = vendorGroups.reduce(
    (sum, vendor) => sum + vendor.gross,
    0
  );

  const totalCommission = vendorGroups.reduce(
    (sum, vendor) => sum + vendor.commission,
    0
  );

  const totalUnpaid = vendorGroups.reduce(
    (sum, vendor) => sum + vendor.unpaid,
    0
  );

  return (
    <main className="min-h-screen bg-slate-100 px-5 py-10">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <p className="text-orange-600 font-black">Adepa Market Admin</p>

          <h1 className="text-4xl md:text-5xl font-black">
            Vendor Payouts
          </h1>

          <p className="text-gray-500 mt-3">
            Track vendor earnings, platform commission and payout status.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-3xl p-6 shadow-sm">
            <Banknote className="text-green-600 mb-3" />
            <p className="text-gray-500 font-bold">Vendor Gross Sales</p>
            <h2 className="text-3xl font-black">
              GH₵ {totalGross.toFixed(2)}
            </h2>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm">
            <Percent className="text-orange-600 mb-3" />
            <p className="text-gray-500 font-bold">Platform Commission</p>
            <h2 className="text-3xl font-black">
              GH₵ {totalCommission.toFixed(2)}
            </h2>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm">
            <Wallet className="text-blue-600 mb-3" />
            <p className="text-gray-500 font-bold">Unpaid Vendor Balance</p>
            <h2 className="text-3xl font-black">
              GH₵ {totalUnpaid.toFixed(2)}
            </h2>
          </div>
        </div>

        {vendorGroups.length === 0 ? (
          <div className="bg-white rounded-[2rem] p-10 text-center">
            <Wallet className="mx-auto text-orange-600 mb-4" size={60} />
            <h2 className="text-2xl font-black">No vendor sales yet</h2>
            <p className="text-gray-500 mt-2">
              Vendor payout data will appear when vendor products are sold.
            </p>
          </div>
        ) : (
          <div className="grid gap-8">
            {vendorGroups.map((vendor) => (
              <div
                key={vendor.vendorId}
                className="bg-white rounded-[2rem] p-6 shadow-sm"
              >
                <div className="flex flex-col lg:flex-row lg:justify-between gap-5 mb-6">
                  <div>
                    <h2 className="text-3xl font-black">
                      {vendor.vendorShopName}
                    </h2>

                    <p className="text-gray-500">{vendor.vendorEmail}</p>
                  </div>

                  <div className="lg:text-right">
                    <p className="font-black">
                      Gross: GH₵ {vendor.gross.toFixed(2)}
                    </p>

                    <p className="text-orange-600 font-black">
                      Commission: GH₵ {vendor.commission.toFixed(2)}
                    </p>

                    <p className="text-green-600 font-black">
                      Vendor Net: GH₵ {vendor.net.toFixed(2)}
                    </p>

                    <p className="text-blue-600 font-black">
                      Unpaid: GH₵ {vendor.unpaid.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="grid gap-4">
                  {vendor.orders.map((sale) => (
                    <div
                      key={`${sale.orderId}-${sale.item.id}`}
                      className="bg-slate-50 rounded-2xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                    >
                      <div>
                        <p className="font-black">{sale.item.name}</p>

                        <p className="text-gray-500">
                          Order #{sale.orderId.slice(0, 8)}
                        </p>

                        <p className="text-gray-500">
                          Qty: {sale.item.quantity}
                        </p>
                      </div>

                      <div>
                        <p className="font-black">
                          Gross: GH₵ {sale.itemTotal.toFixed(2)}
                        </p>

                        <p className="text-orange-600 font-black">
                          Commission: GH₵ {sale.commission.toFixed(2)}
                        </p>

                        <p className="text-green-600 font-black">
                          Pay Vendor: GH₵ {sale.net.toFixed(2)}
                        </p>
                      </div>

                      <div className="flex gap-3 flex-wrap">
                        <span
                          className={`px-4 py-2 rounded-full font-black flex items-center gap-2 ${
                            sale.payoutStatus === "Paid"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {sale.payoutStatus === "Paid" ? (
                            <CheckCircle size={18} />
                          ) : (
                            <Clock size={18} />
                          )}
                          {sale.payoutStatus}
                        </span>

                        <button
                          onClick={() => markOrderPaid(sale.orderId)}
                          className="bg-green-600 text-white px-4 py-2 rounded-full font-black"
                        >
                          Mark Paid
                        </button>

                        <button
                          onClick={() => markOrderUnpaid(sale.orderId)}
                          className="bg-black text-white px-4 py-2 rounded-full font-black"
                        >
                          Mark Unpaid
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}