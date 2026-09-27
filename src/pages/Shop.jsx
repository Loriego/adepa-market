import { useEffect, useMemo, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import {
  Search,
  SlidersHorizontal,
  Store,
  Flame,
  RotateCcw,
  Tags,
  ShoppingBag,
  BadgePercent,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import { db } from "../firebase/firebaseConfig";

export default function Shop() {
  const [products, setProducts] = useState([]);

  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const [category, setCategory] = useState("All");
  const [vendor, setVendor] = useState("All");
  const [sort, setSort] = useState("Newest");
  const [flashOnly, setFlashOnly] = useState(false);

  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [discountOnly, setDiscountOnly] = useState(false);

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

  const categories = useMemo(() => {
    return [
      "All",
      ...new Set(products.map((item) => item.category).filter(Boolean)),
    ];
  }, [products]);

  const vendors = useMemo(() => {
    return [
      "All",
      ...new Set(products.map((item) => item.vendorShopName).filter(Boolean)),
    ];
  }, [products]);

  const flashProducts = products.filter(
    (item) => item.isFlashSale || Number(item.discount) > 0
  ).length;

  const sponsoredProducts = products.filter(
    (item) => item.sponsored === true
  ).length;

  const handleSearch = (value) => {
    setSearch(value);

    if (!value.trim()) {
      setSuggestions([]);
      return;
    }

    const matches = products
      .filter((product) => {
        const text = `
          ${product.name || ""}
          ${product.category || ""}
          ${product.vendorShopName || ""}
        `.toLowerCase();

        return text.includes(value.toLowerCase());
      })
      .slice(0, 6);

    setSuggestions(matches);
  };

  const chooseSuggestion = (product) => {
    setSearch(product.name || "");
    setCategory("All");
    setVendor("All");
    setSuggestions([]);
  };

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
    .filter((product) =>
      minPrice ? Number(product.price) >= Number(minPrice) : true
    )
    .filter((product) =>
      maxPrice ? Number(product.price) <= Number(maxPrice) : true
    )
    .filter((product) =>
      discountOnly ? Number(product.discount) > 0 : true
    )
    .sort((a, b) => {
      if (a.sponsored && !b.sponsored) return -1;
      if (!a.sponsored && b.sponsored) return 1;

      if (sort === "Price Low → High") return Number(a.price) - Number(b.price);
      if (sort === "Price High → Low") return Number(b.price) - Number(a.price);

      if (sort === "Highest Discount") {
        return Number(b.discount || 0) - Number(a.discount || 0);
      }

      if (sort === "Flash Sale First") {
        return (
          Number(b.isFlashSale || Number(b.discount) > 0) -
          Number(a.isFlashSale || Number(a.discount) > 0)
        );
      }

      return 0;
    });

  const resetFilters = () => {
    setSearch("");
    setSuggestions([]);
    setCategory("All");
    setVendor("All");
    setSort("Newest");
    setFlashOnly(false);
    setMinPrice("");
    setMaxPrice("");
    setDiscountOnly(false);
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-slate-50 overflow-x-hidden">
        <section className="bg-gray-950 text-white py-10 md:py-14">
          <div className="max-w-7xl mx-auto px-5">
            <p className="text-orange-400 text-xs font-extrabold tracking-[0.14em]">
              ADEPA MARKETPLACE
            </p>

            <h1 className="text-3xl md:text-5xl font-black tracking-tight mt-2">
              Shop Products
            </h1>

            <p className="text-gray-400 mt-3 max-w-2xl text-sm md:text-base leading-7">
              Search products by name, category, vendor shop, flash sales and
              best deals across Adepa Market.
            </p>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-5 -mt-6 relative z-10">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-[0_14px_40px_rgba(15,23,42,0.07)] p-4 md:p-5 grid md:grid-cols-5 gap-3">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-4 top-4 text-gray-400" />

              <input
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                onFocus={() => {
                  if (search.trim()) handleSearch(search);
                }}
                placeholder="Search products, categories or vendors..."
                className="w-full border border-slate-200 p-3.5 pl-12 rounded-xl outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 text-sm transition"
              />

              {suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-white border rounded-2xl shadow-xl mt-2 z-[9999] overflow-hidden">
                  {suggestions.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => chooseSuggestion(item)}
                      className="w-full text-left px-5 py-4 hover:bg-orange-50 transition border-b last:border-none flex items-center gap-4"
                    >
                      <img
                        src={
                          item.image ||
                          item.images?.[0] ||
                          "https://via.placeholder.com/80"
                        }
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded-xl bg-slate-100"
                      />

                      <div className="min-w-0">
                        <p className="font-black truncate">{item.name}</p>
                        <p className="text-sm text-gray-500">
                          {item.category || "Product"} • GH₵ {item.price}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <select
              value={vendor}
              onChange={(e) => setVendor(e.target.value)}
              className="border border-slate-200 p-3.5 rounded-xl outline-none focus:border-orange-600"
            >
              {vendors.map((item) => (
                <option key={item} value={item}>
                  {item === "All" ? "All Vendors" : item}
                </option>
              ))}
            </select>

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="border border-slate-200 p-3.5 rounded-xl outline-none focus:border-orange-600"
            >
              <option>Newest</option>
              <option>Price Low → High</option>
              <option>Price High → Low</option>
              <option>Highest Discount</option>
              <option>Flash Sale First</option>
            </select>

            <button
              onClick={resetFilters}
              className="bg-gray-950 hover:bg-orange-600 text-white rounded-xl p-3.5 text-sm font-extrabold flex items-center justify-center gap-2 active:scale-95 transition"
            >
              <RotateCcw size={20} />
              Reset Filters
            </button>

            <div className="md:col-span-5 flex flex-wrap gap-3 pt-2">
              {categories.map((item) => (
                <button
                  key={item}
                  onClick={() => setCategory(item)}
                  className={`px-4 py-2 rounded-full text-sm font-bold transition ${
                    category === item
                      ? "bg-orange-600 text-white shadow"
                      : "bg-slate-100 text-slate-700 hover:bg-orange-100"
                  }`}
                >
                  {item === "All" ? "All Categories" : item}
                </button>
              ))}
            </div>

            <div className="md:col-span-5 grid md:grid-cols-3 gap-4">
              <input
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder="Minimum Price"
                className="border p-4 rounded-2xl outline-none focus:border-orange-600"
              />

              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="Maximum Price"
                className="border p-4 rounded-2xl outline-none focus:border-orange-600"
              />

              <label className="bg-orange-50 rounded-2xl p-4 flex items-center gap-3 font-black cursor-pointer">
                <input
                  type="checkbox"
                  checked={discountOnly}
                  onChange={(e) => setDiscountOnly(e.target.checked)}
                />
                Discounted Products Only
              </label>
            </div>

            <label className="md:col-span-2 bg-orange-50 rounded-2xl p-5 flex items-center gap-3 font-black cursor-pointer">
              <input
                type="checkbox"
                checked={flashOnly}
                onChange={(e) => setFlashOnly(e.target.checked)}
              />
              <Flame className="text-red-600" size={20} />
              Show Deals / Flash Sales Only
            </label>

            <div className="bg-red-50 text-red-600 rounded-2xl p-5 font-black flex items-center gap-2">
              <BadgePercent size={20} />
              {flashProducts} Flash Deals
            </div>

            <div className="bg-yellow-50 text-yellow-700 rounded-2xl p-5 font-black flex items-center gap-2">
              👑 {sponsoredProducts} Sponsored
            </div>

            <div className="md:col-span-5 bg-slate-50 rounded-2xl p-5 flex flex-wrap gap-3 items-center">
              <span className="font-black flex items-center gap-2">
                <Store size={18} />
                Active Filters:
              </span>

              <span className="bg-white px-4 py-2 rounded-full font-bold">
                {category === "All" ? "All Categories" : category}
              </span>

              <span className="bg-white px-4 py-2 rounded-full font-bold">
                {vendor === "All" ? "All Vendors" : vendor}
              </span>

              <span className="bg-white px-4 py-2 rounded-full font-bold">
                {sort}
              </span>

              {flashOnly && (
                <span className="bg-red-600 text-white px-4 py-2 rounded-full font-bold">
                  Deals Only
                </span>
              )}

              {discountOnly && (
                <span className="bg-orange-600 text-white px-4 py-2 rounded-full font-bold">
                  Discount Only
                </span>
              )}

              {minPrice && (
                <span className="bg-white px-4 py-2 rounded-full font-bold">
                  Min: GH₵ {minPrice}
                </span>
              )}

              {maxPrice && (
                <span className="bg-white px-4 py-2 rounded-full font-bold">
                  Max: GH₵ {maxPrice}
                </span>
              )}
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-5 py-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
            <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
              <ShoppingBag className="text-orange-600 mb-3" />
              <p className="text-gray-500 font-bold">Total Products</p>
              <h3 className="text-2xl font-black tracking-tight">{products.length}</h3>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
              <Store className="text-orange-600 mb-3" />
              <p className="text-gray-500 font-bold">Vendor Stores</p>
              <h3 className="text-2xl font-black tracking-tight">{vendors.length - 1}</h3>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
              <Tags className="text-orange-600 mb-3" />
              <p className="text-gray-500 font-bold">Categories</p>
              <h3 className="text-2xl font-black tracking-tight">{categories.length - 1}</h3>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
              <BadgePercent className="text-yellow-500 mb-3" />
              <p className="text-gray-500 font-bold">Sponsored</p>
              <h3 className="text-2xl font-black tracking-tight">{sponsoredProducts}</h3>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-8">
            <div className="flex items-center gap-3">
              <SlidersHorizontal className="text-orange-600" />
              <h2 className="text-2xl font-black tracking-tight">
                Showing {filteredProducts.length} of {products.length} Products
              </h2>
            </div>

            <p className="text-gray-500 font-bold">
              Sponsored products appear first.
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