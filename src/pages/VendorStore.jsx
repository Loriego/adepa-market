import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import {
  Store,
  Mail,
  Phone,
  MapPin,
  PackageCheck,
  Search,
  Star,
  BadgeCheck,
  Users,
  ShoppingBag,
  MessageCircle,
  RotateCcw,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import { db } from "../firebase/firebaseConfig";

export default function VendorStore() {
  const { vendorId } = useParams();

  const [vendor, setVendor] = useState(null);
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

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

  const categories = useMemo(() => {
    return [
      "All",
      ...new Set(products.map((item) => item.category).filter(Boolean)),
    ];
  }, [products]);

  const filteredProducts = products
    .filter((product) => {
      const searchable = `
        ${product.name || ""}
        ${product.category || ""}
        ${product.description || ""}
      `.toLowerCase();

      return searchable.includes(search.toLowerCase());
    })
    .filter((product) =>
      category === "All" ? true : product.category === category
    );

  const resetFilters = () => {
    setSearch("");
    setCategory("All");
  };

  const whatsappMessage = encodeURIComponent(
    `Hello ${vendor?.shopName || "Vendor"}, I saw your shop on Adepa Market and I want to make enquiries.`
  );

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-slate-100 overflow-x-hidden">
        <section className="bg-black text-white px-5 py-16 md:py-20 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_#f97316,_transparent_35%),radial-gradient(circle_at_bottom_left,_#22c55e,_transparent_30%)]" />

          <div className="max-w-7xl mx-auto relative z-10">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
              <div className="flex flex-col md:flex-row md:items-center gap-8">
                <div className="w-32 h-32 rounded-[2rem] bg-orange-600 flex items-center justify-center shadow-2xl border-4 border-white/10">
                  <Store size={60} />
                </div>

                <div>
                  <p className="text-orange-500 font-black tracking-wide">
                    ADEPA VERIFIED SELLER
                  </p>

                  <h1 className="text-4xl md:text-6xl font-black mt-2 leading-tight">
                    {vendor?.shopName || "Vendor Store"}
                  </h1>

                  <p className="text-white/70 mt-4 max-w-2xl text-lg">
                    Shop trusted products from this seller on Adepa Market.
                  </p>

                  <div className="flex gap-3 flex-wrap mt-5">
                    <span className="bg-green-600 text-white px-4 py-2 rounded-full font-black flex items-center gap-2">
                      <BadgeCheck size={18} />
                      {vendor?.status || "Approved"}
                    </span>

                    {vendor?.category && (
                      <span className="bg-white/10 text-white px-4 py-2 rounded-full font-black">
                        {vendor.category}
                      </span>
                    )}

                    <span className="bg-yellow-500 text-black px-4 py-2 rounded-full font-black flex items-center gap-2">
                      <Star size={18} fill="currentColor" />
                      4.8 Store Rating
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur rounded-[2rem] p-5 min-w-[260px]">
                <p className="text-white/60 font-bold">Store Summary</p>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <p className="text-3xl font-black">{products.length}</p>
                    <p className="text-white/60 text-sm font-bold">Products</p>
                  </div>

                  <div>
                    <p className="text-3xl font-black">4.8</p>
                    <p className="text-white/60 text-sm font-bold">Rating</p>
                  </div>
                </div>

                {vendor?.phone && (
                  <a
                    href={`https://wa.me/233${String(vendor.phone).replace(/^0/, "")}?text=${whatsappMessage}`}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-5 bg-green-600 text-white py-3 rounded-full font-black flex items-center justify-center gap-2"
                  >
                    <MessageCircle size={18} />
                    WhatsApp Seller
                  </a>
                )}
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
                <p className="text-gray-500 break-all mt-2">
                  {vendor.email || "Not provided"}
                </p>
              </div>

              <div className="bg-slate-50 rounded-3xl p-5">
                <p className="font-black flex items-center gap-2">
                  <Phone size={18} />
                  Phone
                </p>
                <p className="text-gray-500 mt-2">
                  {vendor.phone || "Not provided"}
                </p>
              </div>

              <div className="bg-slate-50 rounded-3xl p-5">
                <p className="font-black flex items-center gap-2">
                  <MapPin size={18} />
                  Location
                </p>
                <p className="text-gray-500 mt-2">
                  {vendor.location || "Not provided"}
                </p>
              </div>
            </div>
          </section>
        )}

        <section className="max-w-7xl mx-auto px-5 py-10">
          <div className="grid sm:grid-cols-3 gap-5 mb-8">
            <div className="bg-white rounded-3xl p-6 shadow-sm">
              <ShoppingBag className="text-orange-600 mb-3" />
              <p className="text-gray-500 font-bold">Total Products</p>
              <h3 className="text-3xl font-black">{products.length}</h3>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-sm">
              <PackageCheck className="text-green-600 mb-3" />
              <p className="text-gray-500 font-bold">Verified Seller</p>
              <h3 className="text-3xl font-black">
                {vendor?.status || "Approved"}
              </h3>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-sm">
              <Users className="text-blue-600 mb-3" />
              <p className="text-gray-500 font-bold">Store Followers</p>
              <h3 className="text-3xl font-black">1.2K</h3>
            </div>
          </div>

          <div className="bg-white rounded-[2rem] shadow-sm p-5 mb-10 grid md:grid-cols-4 gap-4">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-5 top-5 text-gray-400" />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products in this store..."
                className="w-full border p-5 pl-14 rounded-2xl outline-none focus:border-orange-600"
              />
            </div>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border p-5 rounded-2xl outline-none focus:border-orange-600"
            >
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item === "All" ? "All Categories" : item}
                </option>
              ))}
            </select>

            <button
              onClick={resetFilters}
              className="bg-black text-white rounded-2xl p-5 font-black flex items-center justify-center gap-2"
            >
              <RotateCcw size={20} />
              Reset
            </button>

            <div className="md:col-span-4 flex flex-wrap gap-3">
              {categories.map((item) => (
                <button
                  key={item}
                  onClick={() => setCategory(item)}
                  className={`px-5 py-3 rounded-full font-black transition ${
                    category === item
                      ? "bg-orange-600 text-white"
                      : "bg-slate-100 hover:bg-orange-100"
                  }`}
                >
                  {item === "All" ? "All Products" : item}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <p className="text-orange-600 font-black">VENDOR PRODUCTS</p>

            <h2 className="text-4xl md:text-5xl font-black">
              Showing {filteredProducts.length} of {products.length} Product(s)
            </h2>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-[2rem] p-10 text-center">
              <Store className="mx-auto text-orange-600 mb-4" size={60} />
              <h2 className="text-2xl font-black">No products found</h2>
              <p className="text-gray-500 mt-2">
                Try another search or category in this store.
              </p>

              <button
                onClick={resetFilters}
                className="mt-6 bg-orange-600 text-white px-8 py-4 rounded-full font-black"
              >
                Reset Store Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
              {filteredProducts.map((product) => (
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