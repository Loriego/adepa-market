import { useEffect, useMemo, useState } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Trash2, PlusCircle, Pencil, Search, Package, Filter } from "lucide-react";
import { db } from "../firebase/firebaseConfig";

export default function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const fetchProducts = async () => {
    const snapshot = await getDocs(collection(db, "products"));
    setProducts(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })));
  };

  useEffect(() => { fetchProducts(); }, []);

  const categories = useMemo(() => ["All", ...new Set(products.map((item) => item.category).filter(Boolean))], [products]);
  const filtered = products.filter((product) => {
    const text = `${product.name || ""} ${product.brand || ""} ${product.sku || ""} ${product.category || ""}`.toLowerCase();
    return text.includes(search.toLowerCase()) && (category === "All" || product.category === category);
  });

  const deleteProduct = async (id) => {
    if (!confirm("Delete this product permanently?")) return;
    await deleteDoc(doc(db, "products", id));
    toast.success("Product deleted");
    fetchProducts();
  };

  const money = (value) => Number(value || 0).toLocaleString("en-GH", { maximumFractionDigits: 2 });

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-7 md:p-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-7">
          <div><p className="text-[10px] tracking-[0.14em] text-orange-600 font-extrabold">CATALOG</p><h1 className="text-2xl md:text-3xl font-black tracking-tight mt-1">Manage products</h1><p className="text-sm text-slate-500 mt-1">{products.length} product{products.length === 1 ? "" : "s"} in the marketplace</p></div>
          <Link to="/admin/add-product" className="bg-orange-600 hover:bg-orange-500 text-white px-4 py-3 rounded-xl text-sm font-black flex items-center justify-center gap-2 transition"><PlusCircle size={17} /> Add product</Link>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-3 mb-5 flex flex-col md:flex-row gap-3">
          <div className="relative flex-1"><Search size={17} className="absolute left-3.5 top-3.5 text-slate-400" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search title, brand, SKU or category..." className="w-full border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-sm outline-none focus:border-orange-500" /></div>
          <div className="relative md:w-60"><Filter size={16} className="absolute left-3.5 top-3.5 text-slate-400" /><select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-sm outline-none bg-white focus:border-orange-500">{categories.map((item) => <option key={item}>{item}</option>)}</select></div>
        </div>

        {!filtered.length ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center"><Package size={30} className="mx-auto text-slate-300" /><p className="font-black mt-3">No products found</p><p className="text-sm text-slate-500 mt-1">Try another search or add a new product.</p></div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
            {filtered.map((product, index) => (
              <div key={product.id} className={`p-4 flex gap-4 items-center ${index ? "border-t border-slate-100" : ""}`}>
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-slate-50 border border-slate-100 flex-shrink-0 overflow-hidden"><img src={product.image || product.images?.[0]} alt={product.name} className="w-full h-full object-contain p-1" /></div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2"><h2 className="text-sm sm:text-base font-black truncate">{product.name}</h2>{product.isFeatured && <span className="text-[9px] bg-orange-50 text-orange-700 px-2 py-1 rounded-full font-bold">FEATURED</span>}</div>
                  <p className="text-xs text-slate-500 mt-1">{product.brand || product.category} · {product.stock || "In Stock"}{product.stockQuantity !== undefined && product.stockQuantity !== "" ? ` · Qty ${product.stockQuantity}` : ""}</p>
                  <p className="font-black mt-2 text-sm">GH₵ {money(product.price)}</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <Link to={`/admin/edit-product/${product.id}`} aria-label="Edit product" className="w-9 h-9 rounded-xl border border-slate-200 hover:border-orange-300 hover:text-orange-600 flex items-center justify-center transition"><Pencil size={16} /></Link>
                  <button onClick={() => deleteProduct(product.id)} aria-label="Delete product" className="w-9 h-9 rounded-xl border border-red-100 text-red-500 hover:bg-red-50 flex items-center justify-center transition"><Trash2 size={16} /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
