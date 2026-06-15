import {
  ShieldCheck,
  Truck,
  BadgeCheck,
  CreditCard,
} from "lucide-react";

const items = [
  {
    icon: ShieldCheck,
    title: "Secure Payments",
  },
  {
    icon: Truck,
    title: "Fast Delivery",
  },
  {
    icon: BadgeCheck,
    title: "Verified Vendors",
  },
  {
    icon: CreditCard,
    title: "Buyer Protection",
  },
];

export default function TrustSection() {
  return (
    <section className="py-20 bg-black text-white">
      <div className="max-w-7xl mx-auto px-5">

        <div className="grid md:grid-cols-4 gap-8">

          {items.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="text-center"
              >
                <Icon
                  size={60}
                  className="mx-auto text-orange-500 mb-4"
                />

                <h3 className="font-black text-xl">
                  {item.title}
                </h3>
              </div>
            );
          })}

        </div>
      </div>
    </section>
  );
}