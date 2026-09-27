import { Search, Heart, ShoppingBag } from "lucide-react";

const items = [
  { icon: Search, title: "Easy to discover", text: "Clear categories, useful search and focused product browsing." },
  { icon: Heart, title: "Easy to remember", text: "Save products to your wishlist and return when you are ready." },
  { icon: ShoppingBag, title: "Easy to buy", text: "A simple cart and checkout flow designed to reduce friction." },
];

export default function CustomerReviews() {
  return (
    <section className="py-10 md:py-14 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-5">
        <div className="max-w-xl mb-6"><p className="text-[10px] tracking-[0.14em] text-orange-600 font-extrabold">SHOP WITH LESS FRICTION</p><h2 className="text-xl md:text-2xl font-black tracking-tight mt-1">Designed around the way people shop</h2><p className="text-sm text-gray-500 mt-2">From discovery to checkout, the experience stays simple and familiar.</p></div>
        <div className="grid md:grid-cols-3 gap-3 md:gap-4">
          {items.map(({ icon: Icon, title, text }) => (
            <div key={title} className="border border-slate-200 rounded-2xl p-5">
              <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center"><Icon size={18} /></div>
              <h3 className="font-black mt-4">{title}</h3><p className="text-sm text-gray-500 leading-6 mt-1">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
