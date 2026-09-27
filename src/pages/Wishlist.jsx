import { Link } from "react-router-dom";
import { Heart, Trash2, ShoppingCart, ArrowRight } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";

export default function Wishlist() {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const money = (value) => Number(value || 0).toLocaleString("en-GH", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <>
      <Navbar />
      <main className="min-h-[70vh] bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-7 md:py-10">
          <div className="mb-6">
            <p className="text-xs font-extrabold tracking-[0.14em] text-orange-600">SAVED FOR LATER</p>
            <div className="flex items-end justify-between gap-4 mt-1">
              <div><h1 className="text-2xl md:text-3xl font-black tracking-tight">Your wishlist</h1><p className="text-sm text-gray-500 mt-1">{wishlist.length} saved {wishlist.length === 1 ? "product" : "products"}</p></div>
              {wishlist.length > 0 && <Link to="/shop" className="hidden sm:flex text-sm font-bold text-gray-500 hover:text-orange-600">Discover more →</Link>}
            </div>
          </div>

          {wishlist.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-3xl p-10 md:p-14 text-center">
              <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-500 mx-auto flex items-center justify-center"><Heart size={25} /></div>
              <h2 className="text-xl font-black mt-5">Nothing saved yet</h2>
              <p className="text-sm text-gray-500 mt-2 max-w-sm mx-auto">Tap the heart on products you like and come back when you are ready.</p>
              <Link to="/shop" className="inline-flex items-center gap-2 mt-6 bg-orange-600 text-white px-6 py-3 rounded-xl text-sm font-extrabold">Explore marketplace <ArrowRight size={16} /></Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-5">
              {wishlist.map((product) => (
                <article key={product.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden group">
                  <Link to={`/product/${product.id}`} className="block aspect-square bg-slate-50 p-3 overflow-hidden">
                    <img src={product.image || product.images?.[0]} alt={product.name} loading="lazy" className="w-full h-full object-contain group-hover:scale-[1.03] transition duration-300" />
                  </Link>
                  <div className="p-3.5 md:p-4">
                    <p className="text-[10px] md:text-[11px] uppercase tracking-wide text-orange-600 font-extrabold">{product.category || "Product"}</p>
                    <Link to={`/product/${product.id}`} className="block text-sm md:text-base font-extrabold mt-1 line-clamp-2 min-h-[40px] hover:text-orange-600">{product.name}</Link>
                    <p className="text-base md:text-lg font-black mt-2">GH₵ {money(product.price)}</p>
                    <div className="grid grid-cols-[1fr_40px] gap-2 mt-3">
                      <button onClick={() => addToCart(product)} className="bg-gray-950 hover:bg-orange-600 text-white py-2.5 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition"><ShoppingCart size={14} /> Add to cart</button>
                      <button onClick={() => removeFromWishlist(product.id)} className="border border-slate-200 hover:bg-red-50 hover:text-red-600 hover:border-red-100 rounded-xl flex items-center justify-center transition" aria-label="Remove from wishlist"><Trash2 size={15} /></button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
