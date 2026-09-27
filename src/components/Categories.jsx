import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { ArrowUpRight } from "lucide-react";
import { db } from "../firebase/firebaseConfig";

const categoryData = [
  {
    name: "Phones & Gadgets",
    search: "phone",
    keywords: ["phone", "phones", "smartphone", "gadget", "mobile"],
    fallback: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Fashion",
    search: "fashion",
    keywords: ["fashion", "clothing", "shirt", "dress", "shoe", "shoes"],
    fallback: "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Computers",
    search: "computer",
    keywords: ["computer", "computers", "laptop", "laptops", "pc"],
    fallback: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Home & Living",
    search: "home",
    keywords: ["home", "living", "furniture", "kitchen", "decor"],
    fallback: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Audio",
    search: "audio",
    keywords: ["audio", "speaker", "headphone", "headphones", "earbuds"],
    fallback: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Gaming",
    search: "gaming",
    keywords: ["gaming", "game", "games", "console", "controller"],
    fallback: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Watches & Accessories",
    search: "watch",
    keywords: ["watch", "watches", "accessories", "accessory", "jewelry"],
    fallback: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Sports & Outdoors",
    search: "sports",
    keywords: ["sport", "sports", "outdoor", "fitness", "gym"],
    fallback: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=900&q=80",
  },
];

export default function Categories() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    let active = true;

    getDocs(collection(db, "products"))
      .then((snapshot) => {
        if (!active) return;
        setProducts(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      })
      .catch(() => {
        // The curated category images below keep this section useful offline.
      });

    return () => {
      active = false;
    };
  }, []);

  const categories = useMemo(
    () =>
      categoryData.map((category) => {
        const match = products.find((product) => {
          const text = `${product.category || ""} ${product.name || ""}`.toLowerCase();
          return category.keywords.some((keyword) => text.includes(keyword));
        });

        return {
          ...category,
          image: match?.image || match?.images?.[0] || category.fallback,
        };
      }),
    [products]
  );

  return (
    <section className="py-9 md:py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-5">
        <div className="flex items-end justify-between gap-5 mb-5">
          <div>
            <p className="text-[11px] font-extrabold tracking-[0.14em] text-orange-600">
              EXPLORE ADEPA
            </p>
            <h2 className="mt-1.5 text-xl md:text-2xl font-black tracking-tight text-gray-950">
              Shop by category
            </h2>
          </div>

          <Link
            to="/shop"
            className="hidden sm:flex items-center gap-1.5 text-sm font-bold text-gray-500 hover:text-orange-600 transition"
          >
            View all <ArrowUpRight size={15} />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-3 gap-y-5 md:gap-5">
          {categories.map((item) => (
            <Link
              to={`/shop?search=${encodeURIComponent(item.search)}`}
              key={item.name}
              className="group block min-w-0"
            >
              <div className="relative aspect-[1.45/1] md:aspect-[1.55/1] overflow-hidden rounded-2xl bg-slate-100 border border-slate-100">
                <img
                  src={item.image}
                  alt={item.name}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent opacity-70" />
                <span className="absolute right-2.5 top-2.5 w-8 h-8 rounded-full bg-white/90 backdrop-blur text-gray-900 flex items-center justify-center opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition">
                  <ArrowUpRight size={15} />
                </span>
              </div>

              <div className="pt-2">
                <h3 className="text-sm md:text-base font-bold text-gray-950 group-hover:text-orange-600 transition truncate">
                  {item.name}
                </h3>
                <p className="text-[11px] md:text-xs text-gray-400 mt-0.5">
                  Explore products
                </p>
              </div>
            </Link>
          ))}
        </div>

        <Link
          to="/shop"
          className="sm:hidden mt-6 w-full border border-slate-200 rounded-xl py-3 text-sm font-extrabold flex items-center justify-center gap-2"
        >
          Browse all products <ArrowUpRight size={15} />
        </Link>
      </div>
    </section>
  );
}
