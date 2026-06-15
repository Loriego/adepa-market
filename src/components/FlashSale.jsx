import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { Flame, ArrowRight, Clock3 } from "lucide-react";
import { Link } from "react-router-dom";

import { db } from "../firebase/firebaseConfig";
import ProductCard from "./ProductCard";

export default function FlashSale() {
  const [products, setProducts] = useState([]);

  const [timeLeft, setTimeLeft] = useState({
    hours: 2,
    minutes: 59,
    seconds: 59,
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { hours, minutes, seconds } = prev;

        if (seconds > 0) {
          seconds--;
        } else {
          seconds = 59;

          if (minutes > 0) {
            minutes--;
          } else {
            minutes = 59;

            if (hours > 0) {
              hours--;
            } else {
              hours = 2;
              minutes = 59;
              seconds = 59;
            }
          }
        }

        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const fetchProducts = async () => {
    try {
      const snapshot = await getDocs(collection(db, "products"));

      const allProducts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setProducts(
        allProducts
          .filter(
            (item) =>
              item.isFlashSale || Number(item.discount) > 0
          )
          .slice(0, 10)
      );
    } catch (error) {
      console.log(error);
    }
  };

  if (products.length === 0) return null;

  return (
    <section className="py-16 bg-gradient-to-r from-red-50 via-orange-50 to-yellow-50">
      <div className="max-w-7xl mx-auto px-5">

        <div className="bg-black text-white rounded-3xl p-6 md:p-8 mb-10">

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

            <div className="flex items-center gap-4">

              <div className="bg-red-600 text-white w-16 h-16 rounded-2xl flex items-center justify-center">
                <Flame size={34} />
              </div>

              <div>
                <p className="text-red-400 font-black">
                  LIMITED TIME OFFERS
                </p>

                <h2 className="text-4xl md:text-5xl font-black">
                  Flash Sale
                </h2>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <Clock3 size={20} />
                <span className="font-bold">
                  Sale Ends In
                </span>
              </div>

              <div className="flex gap-3">

                <div className="bg-white text-black px-4 py-3 rounded-2xl text-center min-w-[80px]">
                  <h3 className="text-3xl font-black">
                    {String(timeLeft.hours).padStart(2, "0")}
                  </h3>
                  <p className="text-xs font-bold">
                    HOURS
                  </p>
                </div>

                <div className="bg-white text-black px-4 py-3 rounded-2xl text-center min-w-[80px]">
                  <h3 className="text-3xl font-black">
                    {String(timeLeft.minutes).padStart(2, "0")}
                  </h3>
                  <p className="text-xs font-bold">
                    MINUTES
                  </p>
                </div>

                <div className="bg-white text-black px-4 py-3 rounded-2xl text-center min-w-[80px]">
                  <h3 className="text-3xl font-black">
                    {String(timeLeft.seconds).padStart(2, "0")}
                  </h3>
                  <p className="text-xs font-bold">
                    SECONDS
                  </p>
                </div>

              </div>
            </div>

            <Link
              to="/shop"
              className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-4 rounded-full font-black flex items-center gap-2 w-fit"
            >
              View All Deals
              <ArrowRight size={18} />
            </Link>

          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>

      </div>
    </section>
  );
}