import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, ShoppingBag, ShieldCheck, Truck, BadgeCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

const slides = [
  {
    eyebrow: "CURATED FOR GHANA",
    title: "Premium shopping, made beautifully simple.",
    subtitle: "Discover fashion, gadgets, accessories and everyday favourites from trusted sellers across Ghana.",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
    button: "Shop collection",
  },
  {
    eyebrow: "TECH WORTH HAVING",
    title: "Smarter electronics. Better everyday living.",
    subtitle: "Explore phones, laptops, gaming gear and useful technology from marketplace vendors.",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9",
    button: "Explore electronics",
  },
  {
    eyebrow: "STYLE, YOUR WAY",
    title: "Fresh fashion for every kind of day.",
    subtitle: "Shop clothing, sneakers, watches and accessories with a cleaner, easier browsing experience.",
    image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b",
    button: "Shop fashion",
  },
  {
    eyebrow: "GROW WITH ADEPA",
    title: "Turn your products into a digital storefront.",
    subtitle: "Build your presence on Adepa Market and reach customers with a modern vendor experience.",
    image: "https://images.unsplash.com/photo-1556740749-887f6717d7e4",
    button: "Browse marketplace",
  },
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  const prevSlide = () => setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  const slide = slides[current];

  return (
    <section className="bg-white">
      <div className="max-w-[1500px] mx-auto px-3 sm:px-5 pt-3 sm:pt-5">
        <div className="relative min-h-[520px] md:min-h-[600px] overflow-hidden rounded-[1.75rem] md:rounded-[2.25rem] bg-gray-950 shadow-[0_24px_70px_rgba(15,23,42,0.14)]">
          <AnimatePresence mode="wait">
            <motion.img
              key={slide.image}
              src={slide.image}
              alt=""
              initial={{ opacity: 0, scale: 1.035 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7 }}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </AnimatePresence>

          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/65 to-black/10" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />

          <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-14 min-h-[520px] md:min-h-[600px] flex items-center">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-2xl"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-md px-4 py-2 text-xs font-extrabold tracking-[0.14em] text-orange-300">
                {slide.eyebrow}
              </div>

              <h1 className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-black tracking-[-0.045em] leading-[0.98] text-white">
                {slide.title}
              </h1>

              <p className="mt-5 text-base sm:text-lg leading-7 text-white/75 max-w-xl">
                {slide.subtitle}
              </p>

              <div className="flex flex-wrap gap-3 mt-8">
                <Link
                  to="/shop"
                  className="bg-orange-600 hover:bg-orange-500 text-white px-6 py-3.5 rounded-xl text-sm font-extrabold flex items-center gap-2 transition duration-300 shadow-lg shadow-orange-950/20"
                >
                  <ShoppingBag size={18} />
                  {slide.button}
                </Link>
                <Link
                  to="/vendor"
                  className="border border-white/25 bg-white/10 hover:bg-white hover:text-gray-950 text-white px-6 py-3.5 rounded-xl text-sm font-extrabold backdrop-blur-md transition duration-300"
                >
                  Sell on Adepa
                </Link>
              </div>

              <div className="hidden sm:flex flex-wrap gap-x-6 gap-y-3 mt-9 text-xs font-bold text-white/70">
                <span className="flex items-center gap-2"><ShieldCheck size={16} className="text-orange-400" /> Secure checkout</span>
                <span className="flex items-center gap-2"><BadgeCheck size={16} className="text-orange-400" /> Trusted vendors</span>
                <span className="flex items-center gap-2"><Truck size={16} className="text-orange-400" /> Convenient delivery</span>
              </div>
            </motion.div>
          </div>

          <div className="absolute bottom-6 right-6 sm:right-8 z-20 flex items-center gap-2">
            <button onClick={prevSlide} aria-label="Previous slide" className="w-10 h-10 rounded-full border border-white/20 bg-black/20 backdrop-blur-md text-white flex items-center justify-center hover:bg-white hover:text-black transition">
              <ChevronLeft size={19} />
            </button>
            <button onClick={nextSlide} aria-label="Next slide" className="w-10 h-10 rounded-full border border-white/20 bg-black/20 backdrop-blur-md text-white flex items-center justify-center hover:bg-white hover:text-black transition">
              <ChevronRight size={19} />
            </button>
          </div>

          <div className="absolute bottom-7 left-6 sm:left-10 lg:left-14 z-20 flex gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrent(index)}
                aria-label={`Go to slide ${index + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${current === index ? "w-8 bg-orange-500" : "w-2 bg-white/45"}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
