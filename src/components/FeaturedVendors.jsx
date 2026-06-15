import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import { Store, BadgeCheck } from "lucide-react";
import { db } from "../firebase/firebaseConfig";

export default function FeaturedVendors() {
  const [vendors, setVendors] = useState([]);

  useEffect(() => {
    loadVendors();
  }, []);

  const loadVendors = async () => {
    try {
      const q = query(
        collection(db, "vendors"),
        where("status", "==", "Approved")
      );

      const snapshot = await getDocs(q);

      setVendors(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-5">

        <div className="flex justify-between items-center mb-10">

          <div>
            <p className="text-orange-600 font-black">
              TRUSTED SELLERS
            </p>

            <h2 className="text-5xl font-black">
              Featured Vendors
            </h2>
          </div>

          <Link
            to="/vendors"
            className="hidden md:flex bg-black text-white px-6 py-3 rounded-full font-black"
          >
            View All
          </Link>

        </div>

        <div className="grid md:grid-cols-4 gap-6">

          {vendors.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <Store
                size={60}
                className="mx-auto text-orange-600 mb-4"
              />

              <h3 className="text-2xl font-black">
                No Vendors Yet
              </h3>
            </div>
          ) : (
            vendors.slice(0, 8).map((vendor) => (
             <div
  key={vendor.id}
  className="group bg-white rounded-[2rem] p-6 border border-slate-200 hover:border-orange-500 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
>
  <div className="flex items-center gap-4 mb-5">

    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center text-white shadow-lg">
      <Store size={36} />
    </div>

    <div>
      <h3 className="font-black text-xl">
        {vendor.shopName}
      </h3>

      <div className="flex items-center gap-2 text-green-600 font-black text-sm mt-1">
        <BadgeCheck size={16} />
        Verified Seller
      </div>
    </div>

  </div>

  <div className="space-y-3">

    <div className="flex justify-between">
      <span className="text-gray-500">
        Location
      </span>

      <span className="font-bold">
        {vendor.location || "Ghana"}
      </span>
    </div>

    <div className="flex justify-between">
      <span className="text-gray-500">
        Rating
      </span>

      <span className="font-black text-yellow-500">
        ★ 4.9
      </span>
    </div>

    <div className="flex justify-between">
      <span className="text-gray-500">
        Status
      </span>

      <span className="text-green-600 font-black">
        Approved
      </span>
    </div>

  </div>

  <Link
    to={`/vendor-store/${vendor.userId}`}
    className="mt-6 block text-center bg-black hover:bg-orange-600 text-white py-3 rounded-xl font-black transition"
  >
    Visit Store
  </Link>
</div>
            ))
          )}

        </div>

      </div>
    </section>
  );
}