import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import {
  Search,
  SlidersHorizontal,
  Store,
  Flame,
  RotateCcw,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import { db } from "../firebase/firebaseConfig";

export default function Shop() {
  const [products, setProducts] = useState([]);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [vendor, setVendor] = useState("All");
  const [sort, setSort] = useState("Newest");
  const [flashOnly, setFlashOnly] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const snapshot = await getDocs(collection(db, "products"));

    const productList = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setProducts(productList);
  };

  const categories = [
    "All",
    ...new Set(products.map((item) => item.category).filter(Boolean)),
  ];

  const vendors = [
    "All",
    ...new Set(
      products
        .map((item) => item.vendorShopName)
        .filter(Boolean)
    ),
  ];

  const filteredProducts = products
    .filter((product) => {
      const searchable = `
        ${product.name || ""}
        ${product.category || ""}
        ${product.description || ""}
        ${product.vendorShopName || ""}
      `.toLowerCase();

      return searchable.includes(search.toLowerCase());
    })
    .filter((product) =>
      category === "All" ? true : product.category === category
    )
    .filter((product) =>
      vendor === "All" ? true : product.vendorShopName === vendor
    )
    .filter((product) =>
      flashOnly ? product.isFlashSale || Number(product.discount) > 0 : true
    )
    .sort((a, b) => {
      if (sort === "Low to High") return Number(a.price) - Number(b.price);
      if (sort === "High to Low") return Number(b.price) - Number(a.price);
      if (sort === "Discount") return Number(b.discount || 0) - Number(a.discount || 0);
      return 0;
    });

  const resetFilters = () => {
    setSearch("");
    setCategory("All");
    setVendor("All");
    setSort("Newest");
    setFlashOnly(false);
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-slate-100">
        <section className="bg-black text-white py-20">
          <div className="max-w-7xl mx-auto px-5">
            <p className="text-orange-500 font-black">ADEPA MARKETPLACE</p>

            <h1 className="text-5xl md:text-7xl font-black mt-3">
              Shop Products
            </h1>

            <p className="text-gray-300 mt-5 max-w-2xl">
              Search products by name, category, vendor shop, flash sales and
              best deals across Adepa Market.
            </p>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-5 -mt-10 relative z-10">
          <div className="bg-white rounded-[2rem] shadow-xl p-5 grid md:grid-cols-5 gap-4">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-5 top-5 text-gray-400" />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products, categories or vendors..."
                className="w-full border p-5 pl-14 rounded-2xl outline-none focus:border-orange-600"
              />
            </div>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border p-5 rounded-2xl outline-none focus:border-orange-600"
            >
              {categories.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>

            <select
              value={vendor}
              onChange={(e) => setVendor(e.target.value)}
              className="border p-5 rounded-2xl outline-none focus:border-orange-600"
            >
              {vendors.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="border p-5 rounded-2xl outline-none focus:border-orange-600"
            >
              <option>Newest</option>
              <option>Low to High</option>
              <option>High to Low</option>
              <option>Discount</option>
            </select>

            <label className="md:col-span-2 bg-orange-50 rounded-2xl p-5 flex items-center gap-3 font-black cursor-pointer">
              <input
                type="checkbox"
                checked={flashOnly}
                onChange={(e) => setFlashOnly(e.target.checked)}
              />
              <Flame className="text-red-600" size={20} />
              Show Deals / Flash Sales Only
            </label>

            <button
              onClick={resetFilters}
              className="bg-black text-white rounded-2xl p-5 font-black flex items-center justify-center gap-2 active:scale-95 transition"
            >
              <RotateCcw size={20} />
              Reset Filters
            </button>

            <div className="md:col-span-2 bg-slate-50 rounded-2xl p-5 flex flex-wrap gap-3 items-center">
              <span className="font-black flex items-center gap-2">
                <Store size={18} />
                Marketplace Filters:
              </span>

              <span className="bg-white px-4 py-2 rounded-full font-bold">
                {category}
              </span>

              <span className="bg-white px-4 py-2 rounded-full font-bold">
                {vendor}
              </span>

              {flashOnly && (
                <span className="bg-red-600 text-white px-4 py-2 rounded-full font-bold">
                  Deals Only
                </span>
              )}
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-5 py-16">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-8">
            <div className="flex items-center gap-3">
              <SlidersHorizontal className="text-orange-600" />

              <h2 className="text-3xl font-black">
                {filteredProducts.length} Product(s) Found
              </h2>
            </div>

            <p className="text-gray-500 font-bold">
              Showing marketplace products from all approved sellers.
            </p>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-[2rem] p-10 text-center">
              <Search className="mx-auto text-orange-600 mb-4" size={60} />

              <h2 className="text-2xl font-black">No products found</h2>

              <p className="text-gray-500 mt-2">
                Try another search, vendor, category or reset filters.
              </p>

              <button
                onClick={resetFilters}
                className="mt-6 bg-orange-600 text-white px-8 py-4 rounded-full font-black"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
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