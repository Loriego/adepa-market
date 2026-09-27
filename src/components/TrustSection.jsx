import { ShieldCheck, Truck, BadgeCheck, CreditCard } from "lucide-react";

const items = [
  { icon: ShieldCheck, title: "Secure checkout", text: "Protected payment flow" },
  { icon: Truck, title: "Delivery", text: "Order delivery across Ghana" },
  { icon: BadgeCheck, title: "Seller status", text: "Approved marketplace vendors" },
  { icon: CreditCard, title: "Flexible payment", text: "Paystack-powered checkout" },
];

export default function TrustSection() {
  return (
    <section className="bg-gray-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-5 py-7 md:py-8 grid grid-cols-2 lg:grid-cols-4 gap-y-6">
        {items.map(({ icon: Icon, title, text }, index) => (
          <div key={title} className={`flex items-start gap-3 px-2 md:px-5 ${index % 2 === 0 ? "border-r border-white/10" : ""} lg:border-r lg:last:border-r-0`}>
            <Icon size={19} className="text-orange-400 mt-0.5 flex-shrink-0" />
            <div><h3 className="text-sm font-extrabold">{title}</h3><p className="text-[11px] text-gray-500 mt-1">{text}</p></div>
          </div>
        ))}
      </div>
    </section>
  );
}
