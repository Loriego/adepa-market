import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { motion } from "framer-motion";
import {
  ShoppingCart,
  Zap,
  MessageCircle,
  Truck,
  ShieldCheck,
  CreditCard,
  ArrowLeft,
  Heart,
  Store,
  Star,
  BadgeCheck,
  PackageCheck,
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
    fetchProduct();
    fetchRelatedProducts();
  }, [id]);

  const fetchProduct = async () => {
    setLoading(true);

    try {
      const docRef = doc(db, "products", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const productData = {
          id: docSnap.id,
          ...docSnap.data(),
        };

        setProduct(productData);
        addRecentlyViewed(productData);
      }
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  };

  const fetchRelatedProducts = async () => {
    try {
      const snapshot = await getDocs(collection(db, "products"));

      const productList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setRelated(productList.filter((item) => item.id !== id).slice(0, 5));
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-slate-100 flex items-center justify-center">
          <div className="bg-white rounded-[2rem] p-10 shadow text-center">
            <h1 className="text-3xl font-black">Loading product...</h1>
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
        <main className="min-h-screen bg-slate-100 flex flex-col items-center justify-center px-5 text-center">
          <div className="bg-white rounded-[2rem] p-10 shadow">
            <h1 className="text-3xl font-black mb-5">Product not found</h1>

            <Link
              to="/shop"
              className="bg-orange-600 text-white px-7 py-3 rounded-full font-black"
            >
              Back to Shop
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const productImages =
    product.images?.length > 0 ? product.images : [product.image];

  const price = Number(product.price || 0);
  const oldPrice = Number(product.oldPrice || 0);
  const savings = oldPrice > price ? oldPrice - price : 0;

  const addMultipleToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
  };

  const buyNow = () => {
    addMultipleToCart();
    navigate("/checkout");
  };

  const orderOnWhatsApp = () => {
    const message = `Hello Adepa Market, I want to order:

Product: ${product.name}
Price: GH₵ ${product.price}
Quantity: ${quantity}
Total: GH₵ ${price * quantity}`;

    window.open(
      `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  return (
    <>
      <Navbar />

      <main className="bg-slate-100 overflow-x-hidden">
        <section className="max-w-7xl mx-auto px-5 py-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 font-black mb-6 hover:text-orange-600"
          >
            <ArrowLeft size={20} />
            Back
          </button>

          <div className="grid lg:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-[2rem] p-5 shadow-sm"
            >
              <Swiper
                modules={[Navigation, Pagination, Thumbs]}
                navigation
                pagination={{ clickable: true }}
                thumbs={{ swiper: thumbsSwiper }}
                className="rounded-[1.5rem]"
              >
                {productImages.map((img, index) => (
                  <SwiperSlide key={index}>
                    <div className="h-[500px] w-full bg-white rounded-[1.5rem] flex items-center justify-center overflow-hidden">
                      <img
                        src={img}
                        alt={product.name}
                        className="max-h-full max-w-full object-contain p-5"
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>

              {productImages.length > 1 && (
                <Swiper
                  modules={[Thumbs]}
                  onSwiper={setThumbsSwiper}
                  slidesPerView={4}
                  spaceBetween={12}
                  className="mt-4"
                >
                  {productImages.map((img, index) => (
                    <SwiperSlide key={index}>
                      <img
                        src={img}
                        alt="Thumbnail"
                        className="h-24 w-full object-contain rounded-2xl cursor-pointer border bg-white p-2"
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-[2rem] p-7 md:p-8 shadow-sm"
            >
              <div className="flex items-center gap-3 flex-wrap">
                <span className="bg-orange-100 text-orange-700 px-4 py-2 rounded-full font-black text-sm">
                  {product.category}
                </span>

                <span
                  className={`px-4 py-2 rounded-full font-black text-sm ${
                    product.stock === "Out of Stock"
                      ? "bg-red-100 text-red-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {product.stock || "In Stock"}
                </span>

                {product.isFlashSale && (
                  <span className="bg-red-600 text-white px-4 py-2 rounded-full font-black text-sm">
                    Flash Sale
                  </span>
                )}

                {Number(product.discount) > 0 && (
                  <span className="bg-black text-white px-4 py-2 rounded-full font-black text-sm">
                    -{product.discount}% OFF
                  </span>
                )}
              </div>

              <h1 className="text-4xl md:text-5xl font-black mt-6 leading-tight">
                {product.name}
              </h1>

              <div className="flex items-center gap-2 mt-4 flex-wrap">
                <div className="flex items-center gap-1 text-yellow-500">
                  <Star fill="currentColor" size={20} />
                  <Star fill="currentColor" size={20} />
                  <Star fill="currentColor" size={20} />
                  <Star fill="currentColor" size={20} />
                  <Star fill="currentColor" size={20} />
                </div>

                <span className="font-black">4.8</span>

                <span className="text-gray-500 font-bold">128 Reviews</span>
              </div>

              {product.vendorId && (
                <div className="mt-6 bg-orange-50 rounded-3xl p-5">
                  <p className="text-gray-500 font-bold">Sold by</p>

                  <Link
                    to={`/vendor-store/${product.vendorId}`}
                    className="mt-2 inline-flex items-center gap-2 text-orange-700 font-black text-lg hover:text-black"
                  >
                    <Store size={22} />
                    {product.vendorShopName || "Vendor Shop"}
                  </Link>

                  <div className="mt-4 flex flex-wrap gap-3">
                    <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full font-black text-sm inline-flex items-center gap-2">
                      <BadgeCheck size={16} />
                      Verified Vendor
                    </span>

                    <Link
                      to={`/vendor-store/${product.vendorId}`}
                      className="bg-orange-600 text-white px-5 py-2 rounded-full font-black inline-flex items-center gap-2"
                    >
                      <Store size={18} />
                      Visit Shop
                    </Link>
                  </div>
                </div>
              )}

              <div className="mt-6">
                <p className="text-4xl font-black text-orange-600">
                  GH₵ {price.toFixed(2)}
                </p>

                {oldPrice > 0 && (
                  <div className="mt-2">
                    <p className="text-gray-400 line-through font-bold text-xl">
                      GH₵ {oldPrice.toFixed(2)}
                    </p>

                    {savings > 0 && (
                      <p className="text-green-600 font-black mt-1">
                        You save GH₵ {savings.toFixed(2)}
                      </p>
                    )}
                  </div>
                )}
              </div>

              <p className="text-gray-600 mt-6 text-lg leading-8">
                {product.description}
              </p>

              <div className="mt-6 bg-slate-50 rounded-3xl p-6">
                <h3 className="text-xl font-black mb-4">Product Details</h3>

                <div className="grid md:grid-cols-2 gap-4 text-gray-600">
                  <p>
                    <strong>Category:</strong> {product.category || "N/A"}
                  </p>

                  <p>
                    <strong>Stock:</strong> {product.stock || "In Stock"}
                  </p>

                  <p>
                    <strong>Vendor:</strong>{" "}
                    {product.vendorShopName || "Adepa Market"}
                  </p>

                  <p>
                    <strong>Supplier:</strong> {product.supplier || "N/A"}
                  </p>
                </div>
              </div>

              <div className="mt-6 bg-green-50 border border-green-200 rounded-3xl p-5 space-y-2">
                <p className="font-black flex items-center gap-2">
                  <Truck size={20} className="text-green-600" />
                  Delivery within 1-3 working days
                </p>

                <p className="font-bold text-gray-600">
                  Delivery available across Ghana.
                </p>

                <p className="font-bold text-gray-600">
                  Pay securely with Mobile Money or Card.
                </p>
              </div>

              <div className="mt-8">
                <p className="font-black mb-3">Quantity</p>

                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="bg-black text-white w-12 h-12 rounded-full font-black text-xl"
                  >
                    -
                  </button>

                  <span className="text-2xl font-black">{quantity}</span>

                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="bg-orange-600 text-white w-12 h-12 rounded-full font-black text-xl"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="sticky bottom-4 z-30 bg-white/95 backdrop-blur-xl border rounded-[2rem] p-4 mt-8 shadow-xl">
                <div className="grid sm:grid-cols-2 gap-4">
                  <button
                    onClick={addMultipleToCart}
                    className="bg-black text-white px-6 py-4 rounded-full font-black flex items-center justify-center gap-2"
                  >
                    <ShoppingCart size={20} />
                    Add to Cart
                  </button>

                  <button
                    onClick={buyNow}
                    className="bg-orange-600 text-white px-6 py-4 rounded-full font-black flex items-center justify-center gap-2"
                  >
                    <Zap size={20} />
                    Buy Now
                  </button>
                </div>
              </div>

              <button
                onClick={() => addToWishlist(product)}
                className="mt-4 w-full bg-red-500 text-white px-6 py-4 rounded-full font-black flex items-center justify-center gap-2"
              >
                <Heart size={20} />
                Add to Wishlist
              </button>

              <button
                onClick={orderOnWhatsApp}
                className="mt-4 w-full bg-green-600 text-white px-6 py-4 rounded-full font-black flex items-center justify-center gap-2"
              >
                <MessageCircle size={20} />
                Order on WhatsApp
              </button>

              <div className="grid sm:grid-cols-3 gap-4 mt-8">
                <div className="bg-slate-50 rounded-2xl p-4">
                  <Truck className="text-orange-600 mb-2" />
                  <h3 className="font-black">Fast Delivery</h3>
                  <p className="text-sm text-gray-500">Across Ghana</p>
                </div>

                <div className="bg-slate-50 rounded-2xl p-4">
                  <ShieldCheck className="text-orange-600 mb-2" />
                  <h3 className="font-black">Trusted</h3>
                  <p className="text-sm text-gray-500">Safe shopping</p>
                </div>

                <div className="bg-slate-50 rounded-2xl p-4">
                  <CreditCard className="text-orange-600 mb-2" />
                  <h3 className="font-black">Pay Online</h3>
                  <p className="text-sm text-gray-500">MoMo & card</p>
                </div>
              </div>

              <div className="mt-6 bg-orange-50 rounded-2xl p-5">
                <p className="font-black flex items-center gap-2">
                  <PackageCheck size={20} />
                  Buyer Protection
                </p>

                <p className="text-gray-600 mt-2">
                  Your payment is protected. Adepa Market keeps your shopping
                  experience safe and simple.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-5 py-14">
          <div className="mb-8">
            <p className="text-orange-600 font-black">You may also like</p>

            <h2 className="text-4xl font-black mt-2">Related Products</h2>
          </div>

          {related.length === 0 ? (
            <div className="bg-white rounded-[2rem] p-10 text-center">
              <p className="text-gray-500 font-bold">
                No related products yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
              {related.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          )}
        </section>

        <ReviewSection productId={product.id} />

        <RecentlyViewedSection />

        <SmartRecommendations currentProduct={product} />
      </main>

      <Footer />
    </>
  );
}