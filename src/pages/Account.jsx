import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { User, Mail, ShieldCheck, ShoppingBag, Bell, Heart, PackageSearch, Store, ArrowRight } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import PushNotificationButton from "../components/PushNotificationButton";

export default function Account() {
  const { user } = useAuth();
  const { cartItems } = useCart();
  const { wishlist } = useWishlist();

  if (!user) {
    return (
      <>
        <Navbar />
        <main className="min-h-[70vh] bg-slate-50 flex items-center justify-center px-4">
          <div className="max-w-md w-full bg-white border border-slate-200 rounded-3xl p-8 text-center">
            <div className="w-14 h-14 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center mx-auto"><User size={24} /></div>
            <h1 className="text-2xl font-black mt-5">Sign in to your account</h1>
            <p className="text-sm text-gray-500 mt-2">View orders, saved products and shopping updates in one place.</p>
            <div className="grid grid-cols-2 gap-3 mt-6">
              <Link to="/login" className="bg-gray-950 text-white py-3 rounded-xl text-sm font-extrabold">Login</Link>
              <Link to="/signup" className="bg-orange-600 text-white py-3 rounded-xl text-sm font-extrabold">Create account</Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const firstLetter = user.email?.charAt(0).toUpperCase() || "A";
  const username = user.email?.split("@")[0] || "Customer";

  const quickLinks = [
    { to: "/my-orders", icon: ShoppingBag, title: "My orders", text: "Track purchases and delivery" },
    { to: "/wishlist", icon: Heart, title: "Wishlist", text: `${wishlist.length} saved product${wishlist.length === 1 ? "" : "s"}` },
    { to: "/cart", icon: ShoppingBag, title: "My cart", text: `${cartItems.length} product${cartItems.length === 1 ? "" : "s"} ready` },
    { to: "/track-order", icon: PackageSearch, title: "Track order", text: "Check a delivery by reference" },
  ];

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-7 md:py-10">
          <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-gray-950 text-white rounded-3xl p-6 md:p-8 overflow-hidden relative">
            <div className="absolute -right-16 -top-20 w-64 h-64 rounded-full bg-orange-600/20 blur-3xl" />
            <div className="relative flex flex-col sm:flex-row sm:items-center gap-5">
              <div className="w-16 h-16 rounded-2xl bg-orange-600 flex items-center justify-center text-2xl font-black shadow-lg shadow-orange-950/20">{firstLetter}</div>
              <div className="min-w-0">
                <p className="text-[11px] font-extrabold tracking-[0.16em] text-orange-400">ADEPA ACCOUNT</p>
                <h1 className="text-2xl md:text-3xl font-black tracking-tight mt-1">Welcome back, {username}</h1>
                <p className="text-sm text-gray-400 mt-1 truncate">{user.email}</p>
              </div>
              <div className="sm:ml-auto inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-300 border border-emerald-400/20 px-3 py-2 rounded-xl text-xs font-extrabold w-fit">
                <ShieldCheck size={15} /> Signed in securely
              </div>
            </div>
          </motion.section>

          <section className="mt-6">
            <div className="flex items-end justify-between mb-4">
              <div><p className="text-xs font-extrabold tracking-[0.14em] text-orange-600">YOUR SHOPPING</p><h2 className="text-xl md:text-2xl font-black mt-1">Everything in one place</h2></div>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {quickLinks.map(({ to, icon: Icon, title, text }) => (
                <Link key={to} to={to} className="group bg-white border border-slate-200 rounded-2xl p-5 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-200/50 transition">
                  <div className="flex items-center justify-between"><div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center"><Icon size={19} /></div><ArrowRight size={16} className="text-gray-300 group-hover:text-orange-600 transition" /></div>
                  <h3 className="font-black mt-4">{title}</h3><p className="text-xs text-gray-500 mt-1">{text}</p>
                </Link>
              ))}
            </div>
          </section>

          <div className="grid lg:grid-cols-[1fr_.8fr] gap-5 mt-6">
            <section className="bg-white border border-slate-200 rounded-2xl p-5 md:p-6">
              <h2 className="font-black">Account details</h2>
              <div className="grid sm:grid-cols-2 gap-3 mt-4">
                <div className="bg-slate-50 rounded-xl p-4 flex gap-3"><User size={18} className="text-orange-600 mt-0.5" /><div><p className="text-[11px] text-gray-400">Username</p><p className="text-sm font-extrabold mt-1">{username}</p></div></div>
                <div className="bg-slate-50 rounded-xl p-4 flex gap-3"><Mail size={18} className="text-orange-600 mt-0.5" /><div className="min-w-0"><p className="text-[11px] text-gray-400">Email</p><p className="text-sm font-extrabold mt-1 break-all">{user.email}</p></div></div>
              </div>
              <Link to="/vendor" className="mt-4 border border-slate-200 rounded-xl p-4 flex items-center gap-3 hover:border-orange-200 hover:bg-orange-50 transition">
                <Store size={19} className="text-orange-600" /><div className="flex-1"><p className="text-sm font-extrabold">Sell on Adepa Market</p><p className="text-xs text-gray-500">Open your marketplace store</p></div><ArrowRight size={16} />
              </Link>
            </section>

            <section className="bg-white border border-slate-200 rounded-2xl p-5 md:p-6">
              <div className="flex gap-3"><div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center"><Bell size={19} /></div><div><h2 className="font-black">Shopping alerts</h2><p className="text-xs text-gray-500 mt-1">Order, delivery and marketplace notifications.</p></div></div>
              <div className="mt-5"><PushNotificationButton /></div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
