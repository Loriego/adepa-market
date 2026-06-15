import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";

const slides = [
  {
    title: "Ghana's Premium Online Marketplace",
    subtitle:
      "Shop fashion, gadgets, sneakers, accessories and viral products from trusted vendors across Ghana.",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
    button: "Shop Now",
  },

  {
    title: "Massive Electronics Deals",
    subtitle:
      "Phones, laptops, gaming accessories and gadgets at unbeatable prices.",
    image:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9",
    button: "Explore Electronics",
  },

  {
    title: "Fashion Trends For Everyone",
    subtitle:
      "Discover premium clothing, sneakers, watches and luxury accessories.",
    image:
      "https://images.unsplash.com/photo-1523381210434-271e8be1f52b",
    button: "Shop Fashion",
  },

  {
    title: "Start Selling On Adepa Market",
    subtitle:
      "Join thousands of vendors and grow your business across Ghana.",
    image:
      "https://images.unsplash.com/photo-1556740749-887f6717d7e4",
    button: "Become Vendor",
  },
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) =>
        prev === slides.length - 1 ? 0 : prev + 1
      );
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrent((prev) =>
      prev === slides.length - 1 ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrent((prev) =>
      prev === 0 ? slides.length - 1 : prev - 1
    );
  };

  return (
    <section className="relative overflow-hidden bg-black">
      <div className="relative h-[700px]">

        <img
          src={slides[current].image}
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />

<div className="relative z-0 max-w-7xl mx-auto px-5 h-full flex items-center">
          <div className="max-w-3xl">

            <p className="text-orange-500 font-black text-xl mb-4">
              ADEPA MARKET
            </p>

            <h1 className="text-6xl md:text-8xl font-black text-white leading-tight">
              {slides[current].title}
            </h1>

            <p className="text-gray-300 text-xl mt-8 max-w-2xl">
              {slides[current].subtitle}
            </p>

            <div className="flex flex-wrap gap-4 mt-10">

              <Link
                to="/shop"
                className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-full font-black flex items-center gap-2"
              >
                <ShoppingBag size={20} />
                {slides[current].button}
              </Link>

              <Link
                to="/vendor"
                className="border border-white text-white px-8 py-4 rounded-full font-black"
              >
                Sell On Adepa
              </Link>

            </div>
          </div>
        </div>

        <button
          onClick={prevSlide}
          className="absolute left-5 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md text-white w-14 h-14 rounded-full flex items-center justify-center"
        >
          <ChevronLeft />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-5 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md text-white w-14 h-14 rounded-full flex items-center justify-center"
        >
          <ChevronRight />
        </button>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`w-4 h-4 rounded-full transition ${
                current === index
                  ? "bg-orange-500"
                  : "bg-white/40"
              }`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}