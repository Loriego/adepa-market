import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { motion } from "framer-motion";
import {
  ShoppingCart, Zap, MessageCircle, Truck, ShieldCheck, CreditCard,
  ArrowLeft, Heart, Store, Star, BadgeCheck, PackageCheck, Minus, Plus,
} from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Thumbs } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/thumbs";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import ReviewSection from "../components/ReviewSection";
import SmartRecommendations from "../components/SmartRecommendations";
import RecentlyViewedSection from "../components/RecentlyViewedSection";
import { db } from "../firebase/firebaseConfig";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useRecentlyViewed } from "../context/RecentlyViewedContext";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();
  const { addRecentlyViewed } = useRecentlyViewed();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  const whatsappNumber = "233247440127";

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [docSnap, productsSnap] = await Promise.all([
          getDoc(doc(db, "products", id)),
          getDocs(collection(db, "products")),
        ]);

        if (docSnap.exists()) {
          const productData = { id: docSnap.id, ...docSnap.data() };
          setProduct(productData);
          addRecentlyViewed(productData);
        } else {
          setProduct(null);
        }

        setRelated(
          productsSnap.docs
            .map((item) => ({ id: item.id, ...item.data() }))
            .filter((item) => item.id !== id)
            .slice(0, 5)
        );
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    load();
    setQuantity(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  const money = (value) =>
    Number(value || 0).toLocaleString("en-GH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="min-h-[70vh] bg-slate-50">
          <div className="max-w-7xl mx-auto px-5 py-8 animate-pulse">
            <div className="h-5 w-24 bg-slate-200 rounded mb-6" />
            <div className="grid lg:grid-cols-2 gap-7">
              <div className="h-[460px] bg-white rounded-3xl border border-slate-100" />
              <div className="bg-white rounded-3xl border border-slate-100 p-7 space-y-5">
                <div className="h-5 w-32 bg-slate-200 rounded" />
                <div className="h-10 w-4/5 bg-slate-200 rounded" />
                <div className="h-7 w-40 bg-slate-200 rounded" />
                <div className="h-24 bg-slate-100 rounded-2xl" />
                <div className="h-12 bg-slate-200 rounded-xl" />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Navbar />
        <main className="min-h-[70vh] bg-slate-50 flex items-center justify-center px-5">
          <div className="max-w-md w-full bg-white border border-slate-200 rounded-3xl p-8 text-center shadow-sm">
            <PackageCheck size={42} className="mx-auto text-orange-600 mb-4" />
            <h1 className="text-2xl font-black">Product not found</h1>
            <p className="text-sm text-gray-500 mt-2">This item may no longer be available.</p>
            <Link to="/shop" className="inline-flex mt-6 bg-orange-600 text-white px-6 py-3 rounded-xl text-sm font-extrabold">
              Back to shop
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const productImages = product.images?.length > 0 ? product.images : [product.image].filter(Boolean);
  const price = Number(product.price || 0);
  const oldPrice = Number(product.oldPrice || 0);
  const savings = oldPrice > price ? oldPrice - price : 0;
  const outOfStock = product.stock === "Out of Stock";

  const addMultipleToCart = () => {
    if (outOfStock) return;
    for (let i = 0; i < quantity; i++) addToCart(product);
  };

  const buyNow = () => {
    if (outOfStock) return;
    addMultipleToCart();
    navigate("/checkout");
  };

  const orderOnWhatsApp = () => {
    const message = `Hello Adepa Market, I want to order:\n\nProduct: ${product.name}\nPrice: GH₵ ${money(price)}\nQuantity: ${quantity}\nTotal: GH₵ ${money(price * quantity)}`;
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, "_blank");
  };

  return (
    <>
      <Navbar />
      <main className="bg-slate-50 overflow-x-hidden pb-24 md:pb-0">
        <section className="max-w-7xl mx-auto px-4 sm:px-5 py-6 md:py-8">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm font-bold text-gray-600 mb-5 hover:text-orange-600 transition">
            <ArrowLeft size={17} /> Back
          </button>

          <div className="grid lg:grid-cols-[1.04fr_.96fr] gap-6 lg:gap-8 items-start">
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl p-3 sm:p-5 border border-slate-100 shadow-sm lg:sticky lg:top-24">
              <Swiper modules={[Navigation, Pagination, Thumbs]} navigation pagination={{ clickable: true }} thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }} className="rounded-2xl">
                {productImages.map((img, index) => (
                  <SwiperSlide key={index}>
                    <div className="h-[360px] sm:h-[480px] w-full bg-gradient-to-b from-slate-50 to-white rounded-2xl flex items-center justify-center overflow-hidden">
                      <img src={img} alt={product.name} className="max-h-full max-w-full object-contain p-5 sm:p-8" />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>

              {productImages.length > 1 && (
                <Swiper modules={[Thumbs]} onSwiper={setThumbsSwiper} slidesPerView={4} spaceBetween={10} className="mt-3">
                  {productImages.map((img, index) => (
                    <SwiperSlide key={index}>
                      <div className="h-20 sm:h-24 rounded-xl border border-slate-200 bg-white p-2 cursor-pointer hover:border-orange-400 transition">
                        <img src={img} alt={`${product.name} thumbnail ${index + 1}`} className="h-full w-full object-contain" />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              )}
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 }} className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-100 shadow-sm">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="bg-orange-50 text-orange-700 px-3 py-1.5 rounded-full font-extrabold text-xs">{product.category || "Product"}</span>
                <span className={`px-3 py-1.5 rounded-full font-extrabold text-xs ${outOfStock ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"}`}>
                  {product.stock || "In Stock"}
                </span>
                {product.isFlashSale && <span className="bg-red-600 text-white px-3 py-1.5 rounded-full font-extrabold text-xs">Flash Sale</span>}
                {Number(product.discount) > 0 && <span className="bg-gray-950 text-white px-3 py-1.5 rounded-full font-extrabold text-xs">-{product.discount}%</span>}
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-[-0.035em] mt-5 leading-tight text-gray-950">{product.name}</h1>

              <div className="flex items-center gap-2 mt-3 text-sm">
                <div className="flex items-center gap-0.5 text-amber-400">
                  {[1,2,3,4,5].map((star) => <Star key={star} fill="currentColor" size={15} />)}
                </div>
                <span className="font-extrabold">4.8</span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-500">128 reviews</span>
              </div>

              <div className="mt-5 flex items-end gap-3 flex-wrap">
                <p className="text-2xl sm:text-3xl font-black tracking-tight text-gray-950">GH₵ {money(price)}</p>
                {oldPrice > 0 && <p className="text-gray-400 line-through font-semibold text-sm pb-1">GH₵ {money(oldPrice)}</p>}
                {savings > 0 && <span className="text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg text-xs font-extrabold mb-0.5">Save GH₵ {money(savings)}</span>}
              </div>

              {product.vendorId && (
                <div className="mt-5 border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <p className="text-xs text-gray-500 font-semibold">Sold by</p>
                    <Link to={`/vendor-store/${product.vendorId}`} className="mt-1 flex items-center gap-2 font-extrabold text-gray-900 hover:text-orange-600 transition">
                      <Store size={17} /> {product.vendorShopName || "Vendor Shop"} <BadgeCheck size={16} className="text-emerald-600" />
                    </Link>
                  </div>
                  <Link to={`/vendor-store/${product.vendorId}`} className="text-xs font-extrabold text-orange-600 hover:text-orange-700">Visit shop →</Link>
                </div>
              )}

              <p className="text-gray-600 mt-5 text-sm sm:text-base leading-7">{product.description}</p>

              <div className="mt-5 grid sm:grid-cols-3 gap-2.5">
                <div className="bg-slate-50 rounded-xl p-3.5"><Truck size={18} className="text-orange-600 mb-2" /><p className="text-sm font-extrabold">Fast delivery</p><p className="text-xs text-gray-500 mt-0.5">Across Ghana</p></div>
                <div className="bg-slate-50 rounded-xl p-3.5"><ShieldCheck size={18} className="text-orange-600 mb-2" /><p className="text-sm font-extrabold">Buyer protection</p><p className="text-xs text-gray-500 mt-0.5">Safer shopping</p></div>
                <div className="bg-slate-50 rounded-xl p-3.5"><CreditCard size={18} className="text-orange-600 mb-2" /><p className="text-sm font-extrabold">Secure payment</p><p className="text-xs text-gray-500 mt-0.5">MoMo & card</p></div>
              </div>

              <div className="mt-6 flex items-center justify-between gap-4 border-t border-slate-100 pt-5">
                <div>
                  <p className="text-sm font-extrabold">Quantity</p>
                  <p className="text-xs text-gray-500">Choose how many you need</p>
                </div>
                <div className="flex items-center rounded-xl border border-slate-200 overflow-hidden">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 flex items-center justify-center hover:bg-slate-50" aria-label="Decrease quantity"><Minus size={16} /></button>
                  <span className="w-10 text-center text-sm font-black">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 flex items-center justify-center hover:bg-slate-50" aria-label="Increase quantity"><Plus size={16} /></button>
                </div>
              </div>

              <div className="hidden md:grid grid-cols-2 gap-3 mt-6">
                <button disabled={outOfStock} onClick={addMultipleToCart} className="bg-gray-950 disabled:bg-gray-300 text-white px-5 py-3.5 rounded-xl text-sm font-extrabold flex items-center justify-center gap-2 hover:bg-gray-800 transition">
                  <ShoppingCart size={18} /> Add to cart
                </button>
                <button disabled={outOfStock} onClick={buyNow} className="bg-orange-600 disabled:bg-orange-300 text-white px-5 py-3.5 rounded-xl text-sm font-extrabold flex items-center justify-center gap-2 hover:bg-orange-700 transition">
                  <Zap size={18} /> Buy now
                </button>
              </div>

              <div className="grid sm:grid-cols-2 gap-3 mt-3">
                <button onClick={() => addToWishlist(product)} className="border border-slate-200 text-gray-700 px-5 py-3 rounded-xl text-sm font-extrabold flex items-center justify-center gap-2 hover:border-red-200 hover:bg-red-50 hover:text-red-600 transition">
                  <Heart size={17} /> Save to wishlist
                </button>
                <button onClick={orderOnWhatsApp} className="border border-slate-200 text-gray-700 px-5 py-3 rounded-xl text-sm font-extrabold flex items-center justify-center gap-2 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 transition">
                  <MessageCircle size={17} /> Ask on WhatsApp
                </button>
              </div>

              <div className="mt-6 border-t border-slate-100 pt-5">
                <h3 className="text-sm font-extrabold">Product details</h3>
                <div className="grid sm:grid-cols-2 gap-x-6 gap-y-2 mt-3 text-sm text-gray-600">
                  <p><span className="font-bold text-gray-800">Category:</span> {product.category || "N/A"}</p>
                  <p><span className="font-bold text-gray-800">Stock:</span> {product.stock || "In Stock"}</p>
                  <p><span className="font-bold text-gray-800">Vendor:</span> {product.vendorShopName || "Adepa Market"}</p>
                  <p><span className="font-bold text-gray-800">Supplier:</span> {product.supplier || "N/A"}</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-5 py-10 md:py-14">
          <p className="text-orange-600 text-xs tracking-[0.14em] font-extrabold">DISCOVER MORE</p>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight mt-2 mb-7">You may also like</h2>
          {related.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-5">
              {related.map((item) => <ProductCard key={item.id} product={item} />)}
            </div>
          ) : (
            <div className="bg-white border border-slate-100 rounded-2xl p-8 text-center text-sm text-gray-500">No related products yet.</div>
          )}
        </section>

        <ReviewSection productId={product.id} />
        <RecentlyViewedSection />
        <SmartRecommendations currentProduct={product} />
      </main>

      <div className="md:hidden fixed bottom-0 inset-x-0 z-[9998] bg-white/95 backdrop-blur-xl border-t border-slate-200 p-3 pb-[calc(.75rem+env(safe-area-inset-bottom))] shadow-[0_-10px_30px_rgba(15,23,42,0.08)]">
        <div className="grid grid-cols-2 gap-2 max-w-lg mx-auto">
          <button disabled={outOfStock} onClick={addMultipleToCart} className="bg-gray-950 disabled:bg-gray-300 text-white py-3 rounded-xl text-sm font-extrabold flex items-center justify-center gap-2"><ShoppingCart size={17} /> Add to cart</button>
          <button disabled={outOfStock} onClick={buyNow} className="bg-orange-600 disabled:bg-orange-300 text-white py-3 rounded-xl text-sm font-extrabold flex items-center justify-center gap-2"><Zap size={17} /> Buy now</button>
        </div>
      </div>
      <Footer />
    </>
  );
}
