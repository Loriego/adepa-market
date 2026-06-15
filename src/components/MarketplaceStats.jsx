import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
} from "firebase/firestore";

import { db } from "../firebase/firebaseConfig";

export default function MarketplaceStats() {
  const [stats, setStats] = useState({
    products: 0,
    vendors: 0,
    customers: 0,
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const productsSnap = await getDocs(
          collection(db, "products")
        );

        const vendorsSnap = await getDocs(
          collection(db, "vendors")
        );

        const usersSnap = await getDocs(
          collection(db, "users")
        );

        setStats({
          products: productsSnap.size,
          vendors: vendorsSnap.size,
          customers: usersSnap.size,
        });
      } catch (error) {
        console.log(error);
      }
    };

    loadStats();
  }, []);

  return (
    <section className="py-14 bg-black text-white">
      <div className="max-w-7xl mx-auto px-5">

        <div className="grid md:grid-cols-4 gap-8 text-center">

          <div>
            <h2 className="text-5xl font-black text-orange-500">
              {stats.products}+
            </h2>
            <p className="mt-2 text-gray-300">
              Products
            </p>
          </div>

          <div>
            <h2 className="text-5xl font-black text-orange-500">
              {stats.vendors}+
            </h2>
            <p className="mt-2 text-gray-300">
              Vendors
            </p>
          </div>

          <div>
            <h2 className="text-5xl font-black text-orange-500">
              {stats.customers}+
            </h2>
            <p className="mt-2 text-gray-300">
              Customers
            </p>
          </div>

          <div>
            <h2 className="text-5xl font-black text-orange-500">
              24/7
            </h2>
            <p className="mt-2 text-gray-300">
              Support
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}