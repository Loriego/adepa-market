import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import {
  Store,
  Package,
  Clock,
  PlusCircle,
  ShoppingBag,
  Settings,
  Wallet,
} from "lucide-react";
import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { db } from "../firebase/firebaseConfig";
import { useAuth } from "../context/AuthContext";

export default function VendorDashboard() {
  const { user } = useAuth();
  const [vendor, setVendor] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (user) {
      fetchVendor();
      fetchVendorProducts();
    }
  }, [user]);

  const fetchVendor = async () => {
    const q = query(collection(db, "vendors"), where("userId", "==", user.uid));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      setVendor({
        id: snapshot.docs[0].id,
        ...snapshot.docs[0].data(),
      });
    }
  };

  const fetchVendorProducts = async () => {
    const q = query(
      collection(db, "products"),
      where("vendorId", "==", user.uid)
    );

    const snapshot = await getDocs(q);

    setProducts(
      snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
    );
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-slate-100 px-5 py-10">
        <div className="max-w-7xl mx-auto">
          <div className="bg-black text-white rounded-[2rem] p-8 mb-8 flex flex-col md:flex-row md:justify-between gap-5">
            <div>
              <p className="text-orange-500 font-black">Vendor Dashboard</p>

              <h1 className="text-4xl md:text-5xl font-black mt-2">
                {vendor?.shopName || "Vendor Account"}
              </h1>

              <p className="text-white/70 mt-3">
                Status: {vendor?.status || "No application found"}
              </p>
            </div>

            {vendor?.status === "Approved" && (
              <div className="flex gap-3 flex-wrap h-fit">
                <Link
                  to="/vendor/add-product"
                  className="bg-orange-600 text-white px-6 py-4 rounded-full font-black flex items-center justify-center gap-2"
                >
                  <PlusCircle size={20} />
                  Add Product
                </Link>

                <Link
                  to="/vendor/products"
                  className="bg-white text-black px-6 py-4 rounded-full font-black flex items-center justify-center gap-2"
                >
                  <Settings size={20} />
                  Manage Products
                </Link>

                <Link
                  to="/vendor/orders"
                  className="bg-white text-black px-6 py-4 rounded-full font-black flex items-center justify-center gap-2"
                >
                  <ShoppingBag size={20} />
                  My Orders
                </Link>

                <Link
                  to="/vendor/earnings"
                  className="bg-green-600 text-white px-6 py-4 rounded-full font-black flex items-center justify-center gap-2"
                >
                  <Wallet size={20} />
                  My Earnings
                </Link>
              </div>
            )}
          </div>

          {!vendor ? (
            <div className="bg-white rounded-[2rem] p-8 text-center">
              <Store className="mx-auto text-orange-600 mb-4" size={60} />

              <h2 className="text-3xl font-black mb-3">
                No Vendor Application
              </h2>

              <p className="text-gray-500">
                Apply first to become a vendor on Adepa Market.
              </p>
            </div>
          ) : vendor.status !== "Approved" ? (
            <div className="bg-yellow-50 rounded-[2rem] p-8">
              <Clock className="text-yellow-600 mb-4" size={50} />

              <h2 className="text-3xl font-black mb-3">
                Application Under Review
              </h2>

              <p className="text-gray-600">
                Your vendor account is currently {vendor.status}. Admin will
                approve your account before you can upload products.
              </p>
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-3xl p-6 shadow-sm">
                  <Package className="text-orange-600 mb-3" />

                  <p className="text-gray-500 font-bold">My Products</p>

                  <h2 className="text-4xl font-black">{products.length}</h2>
                </div>

                <Link
                  to="/vendor/orders"
                  className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-xl transition"
                >
                  <ShoppingBag className="text-blue-600 mb-3" />

                  <p className="text-gray-500 font-bold">Vendor Orders</p>

                  <h2 className="text-2xl font-black">View Orders</h2>
                </Link>

                <Link
                  to="/vendor/earnings"
                  className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-xl transition"
                >
                  <Wallet className="text-green-600 mb-3" />

                  <p className="text-gray-500 font-bold">Earnings</p>

                  <h2 className="text-2xl font-black">View Payouts</h2>
                </Link>
              </div>

              <div className="bg-white rounded-[2rem] p-8">
                <h2 className="text-3xl font-black mb-5">Recent Products</h2>

                {products.length === 0 ? (
                  <p className="text-gray-500">No products uploaded yet.</p>
                ) : (
                  <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
                    {products.slice(0, 4).map((product) => (
                      <div key={product.id} className="border rounded-3xl p-4">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-40 w-full object-cover rounded-2xl"
                        />

                        <h3 className="font-black mt-3">{product.name}</h3>

                        <p className="text-orange-600 font-black">
                          GH₵ {product.price}
                        </p>

                        <p className="text-gray-500 text-sm mt-1">
                          {product.stock}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}