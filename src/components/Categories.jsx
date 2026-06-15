import {
  Smartphone,
  Shirt,
  Gamepad2,
  Watch,
  Headphones,
  Home,
  Laptop,
  ShoppingBag,
} from "lucide-react";

const categories = [
  { name: "Phones", icon: Smartphone },
  { name: "Fashion", icon: Shirt },
  { name: "Gaming", icon: Gamepad2 },
  { name: "Watches", icon: Watch },
  { name: "Audio", icon: Headphones },
  { name: "Home", icon: Home },
  { name: "Computers", icon: Laptop },
  { name: "Accessories", icon: ShoppingBag },
];

export default function Categories() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-5">
        <h2 className="text-5xl font-black mb-10">
          Shop By Category
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-5">
          {categories.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.name}
                className="bg-slate-100 hover:bg-orange-600 hover:text-white transition rounded-3xl p-6 text-center cursor-pointer"
              >
                <Icon size={40} className="mx-auto mb-4" />
                <h3 className="font-black">{item.name}</h3>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}