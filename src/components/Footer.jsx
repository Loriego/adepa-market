import { Link } from "react-router-dom";
import { ShoppingCart, Instagram, Facebook, Mail, Phone, MapPin, ArrowUp } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();
  const top = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="bg-[#0b111a] text-white mt-0">
      <button onClick={top} className="w-full bg-slate-800 hover:bg-slate-700 py-3 text-xs font-bold text-slate-300 flex items-center justify-center gap-2 transition"><ArrowUp size={14} /> Back to top</button>

      <div className="max-w-7xl mx-auto px-5 py-10 md:py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-[1.25fr_.75fr_.75fr_1fr] gap-8">
          <div>
            <Link to="/" className="inline-flex items-center gap-2">
              <span className="w-9 h-9 rounded-xl bg-orange-600 flex items-center justify-center"><ShoppingCart size={20} /></span>
              <span className="text-xl font-black">Adepa<span className="text-orange-500">Market</span></span>
            </Link>
            <p className="text-sm text-slate-400 leading-6 mt-4 max-w-sm">A modern marketplace for discovering products and shopping from sellers in Ghana.</p>
            <div className="flex gap-2 mt-5">
              <a href="https://www.instagram.com/" target="_blank" rel="noreferrer" aria-label="Instagram" className="w-9 h-9 rounded-lg border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:border-orange-500 transition"><Instagram size={16} /></a>
              <a href="https://www.facebook.com/" target="_blank" rel="noreferrer" aria-label="Facebook" className="w-9 h-9 rounded-lg border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:border-orange-500 transition"><Facebook size={16} /></a>
            </div>
          </div>

          <div><h3 className="text-sm font-extrabold">Shop</h3><div className="mt-4 space-y-3 text-sm text-slate-400"><Link className="block hover:text-white" to="/shop">All products</Link><Link className="block hover:text-white" to="/shop?deals=true">Deals</Link><Link className="block hover:text-white" to="/wishlist">Wishlist</Link><Link className="block hover:text-white" to="/cart">Cart</Link></div></div>

          <div><h3 className="text-sm font-extrabold">Account</h3><div className="mt-4 space-y-3 text-sm text-slate-400"><Link className="block hover:text-white" to="/account">My account</Link><Link className="block hover:text-white" to="/my-orders">My orders</Link><Link className="block hover:text-white" to="/track-order">Track order</Link><Link className="block hover:text-white" to="/vendor">Sell on Adepa</Link></div></div>

          <div><h3 className="text-sm font-extrabold">Contact</h3><div className="mt-4 space-y-3 text-sm text-slate-400"><p className="flex gap-2"><MapPin size={15} className="text-orange-500 mt-0.5" /> Ghana</p><a href="tel:+233247440127" className="flex gap-2 hover:text-white"><Phone size={15} className="text-orange-500" /> +233 24 744 0127</a><Link to="/contact" className="flex gap-2 hover:text-white"><Mail size={15} className="text-orange-500" /> Contact support</Link></div></div>
        </div>

        <div className="mt-10 pt-5 border-t border-white/10 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between text-[11px] text-slate-500">
          <p>© {year} Adepa Market. All rights reserved.</p>
          <div className="flex gap-4"><span>GHS · Ghanaian Cedi</span><span>Secure checkout</span></div>
        </div>
      </div>
    </footer>
  );
}
