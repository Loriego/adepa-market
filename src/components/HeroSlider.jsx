import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, ShoppingBag, ShieldCheck, Truck, BadgeCheck, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

const slides = [
  {
    eyebrow: "CURATED FOR GHANA",
    title: "Everything you need, in one beautiful marketplace.",
    subtitle: "Discover everyday essentials, fashion and technology from sellers on Adepa Market.",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1800&q=88",
    button: "Shop now",
    href: "/shop",
  },
  {
    eyebrow: "TECH & GADGETS",
    title: "Upgrade the way you work, play and connect.",
    subtitle: "Browse phones, computers, audio and useful technology with a faster shopping experience.",
    image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=1800&q=88",
    button: "Explore technology",
    href: "/shop?search=electronics",
  },
  {
    eyebrow: "STYLE EDIT",
    title: "Fresh finds for your everyday style.",
    subtitle: "Explore clothing, footwear, watches and accessories in one curated destination.",
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1800&q=88",
    button: "Shop fashion",
    href: "/shop?search=fashion",
  },
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrent((prev) => (prev + 1) % slides.length), 6500);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[current];
  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));

  return (
    <section className="bg-white">
      <div className="max-w-[1500px] mx-auto px-3 sm:px-5 pt-3 sm:pt-5">
        <div className="relative h-[440px] sm:h-[500px] lg:h-[560px] overflow-hidden rounded-[1.5rem] md:rounded-[2rem] bg-gray-950">
          <AnimatePresence mode="wait">
            <motion.img
              key={slide.image}
              src={slide.image}
              alt=""
              initial={{ opacity: 0, scale: 1.025 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.65 }}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </AnimatePresence>

          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/58 to-black/10" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

          <div className="relative z-10 h-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-14 flex items-center">
            <motion.div key={current} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="max-w-xl lg:max-w-2xl">
              <p className="text-[11px] sm:text-xs font-extrabold tracking-[0.16em] text-orange-300">{slide.eyebrow}</p>
              <h1 className="mt-3 text-[2.25rem] sm:text-5xl lg:text-[3.5rem] font-black tracking-[-0.045em] leading-[1.02] text-white">{slide.title}</h1>
              <p className="mt-4 text-sm sm:text-base leading-6 sm:leading-7 text-white/75 max-w-lg">{slide.subtitle}</p>

              <div className="flex flex-wrap gap-2.5 mt-6">
                <Link to={slide.href} className="bg-orange-600 hover:bg-orange-500 text-white px-5 py-3 rounded-xl text-sm font-extrabold flex items-center gap-2 transition">
                  <ShoppingBag size={17} /> {slide.button}
                </Link>
                <Link to="/shop" className="border border-white/25 bg-white/10 hover:bg-white hover:text-gray-950 text-white px-5 py-3 rounded-xl text-sm font-extrabold backdrop-blur-md transition flex items-center gap-2">
                  Browse all <ArrowRight size={16} />
                </Link>
              </div>

              <div className="hidden sm:flex flex-wrap gap-x-5 gap-y-2 mt-7 text-[11px] font-bold text-white/70">
                <span className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-orange-400" /> Secure checkout</span>
                <span className="flex items-center gap-1.5"><BadgeCheck size={14} className="text-orange-400" /> Marketplace sellers</span>
                <span className="flex items-center gap-1.5"><Truck size={14} className="text-orange-400" /> Ghana delivery</span>
              </div>
            </motion.div>
          </div>

          <div className="absolute bottom-5 right-5 sm:right-8 z-20 flex gap-2">
            <button onClick={prevSlide} aria-label="Previous slide" className="w-9 h-9 rounded-full border border-white/20 bg-black/25 backdrop-blur text-white flex items-center justify-center hover:bg-white hover:text-black transition"><ChevronLeft size={18} /></button>
            <button onClick={nextSlide} aria-label="Next slide" className="w-9 h-9 rounded-full border border-white/20 bg-black/25 backdrop-blur text-white flex items-center justify-center hover:bg-white hover:text-black transition"><ChevronRight size={18} /></button>
          </div>

          <div className="absolute bottom-6 left-6 sm:left-10 lg:left-14 z-20 flex gap-1.5">
            {slides.map((_, index) => (
              <button key={index} onClick={() => setCurrent(index)} aria-label={`Go to slide ${index + 1}`} className={`h-1 rounded-full transition-all ${current === index ? "w-7 bg-orange-500" : "w-2 bg-white/45"}`} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
