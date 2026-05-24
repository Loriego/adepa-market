import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import { Store, Mail, Phone, MapPin, PackageCheck } from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import { db } from "../firebase/firebaseConfig";

export default function VendorStore() {
  const { vendorId } = useParams();

  const [vendor, setVendor] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchVendorStore();
  }, [vendorId]);

  const fetchVendorStore = async () => {
    const vendorQuery = query(
      collection(db, "vendors"),
      where("userId", "==", vendorId)
    );

    const vendorSnapshot = await getDocs(vendorQuery);

    if (!vendorSnapshot.empty) {
      setVendor({
        id: vendorSnapshot.docs[0].id,
        ...vendorSnapshot.docs[0].data(),
      });
    }

    const productQuery = query(
      collection(db, "products"),
      where("vendorId", "==", vendorId)
    );

    const productSnapshot = await getDocs(productQuery);

    setProducts(
      productSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
    );
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-slate-100">
        <section className="bg-black text-white px-5 py-20">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center gap-8">
              <div className="w-28 h-28 rounded-[2rem] bg-orange-600 flex items-center justify-center">
                <Store size={55} />
              </div>

              <div>
                <p className="text-orange-500 font-black">
                  ADEPA MARKET VENDOR
                </p>

                <h1 className="text-4xl md:text-6xl font-black mt-2">
                  {vendor?.shopName || "Vendor Store"}
                </h1>

                <p className="text-white/70 mt-4 max-w-2xl">
                  Shop all products from this trusted Adepa Market vendor.
                </p>

                <div className="flex gap-3 flex-wrap mt-5">
                  <span className="bg-green-600 text-white px-4 py-2 rounded-full font-black flex items-center gap-2">
                    <PackageCheck size={18} />
                    {vendor?.status || "Approved"}
                  </span>

                  {vendor?.category && (
                    <span className="bg-white/10 text-white px-4 py-2 rounded-full font-black">
                      {vendor.category}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {vendor && (
          <section className="max-w-7xl mx-auto px-5 -mt-10 relative z-10">
            <div className="bg-white rounded-[2rem] shadow-xl p-6 grid md:grid-cols-3 gap-5">
              <div className="bg-slate-50 rounded-3xl p-5">
                <p className="font-black flex items-center gap-2">
                  <Mail size={18} />
                  Email
                </p>
                <p className="text-gray-500 break-all mt-2">{vendor.email}</p>
              </div>

              <div className="bg-slate-50 rounded-3xl p-5">
                <p className="font-black flex items-center gap-2">
                  <Phone size={18} />
                  Phone
                </p>
                <p className="text-gray-500 mt-2">{vendor.phone}</p>
              </div>

              <div className="bg-slate-50 rounded-3xl p-5">
                <p className="font-black flex items-center gap-2">
                  <MapPin size={18} />
                  Location
                </p>
                <p className="text-gray-500 mt-2">{vendor.location}</p>
              </div>
            </div>
          </section>
        )}

        <section className="max-w-7xl mx-auto px-5 py-16">
          <div className="mb-8">
            <p className="text-orange-600 font-black">VENDOR PRODUCTS</p>

            <h2 className="text-4xl md:text-5xl font-black">
              {products.length} Product(s)
            </h2>
          </div>

          {products.length === 0 ? (
            <div className="bg-white rounded-[2rem] p-10 text-center">
              <Store className="mx-auto text-orange-600 mb-4" size={60} />
              <h2 className="text-2xl font-black">No products yet</h2>
              <p className="text-gray-500 mt-2">
                This vendor has not uploaded products yet.
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
}