import { Link } from "react-router-dom";
import { Home, ShoppingBag } from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function NotFound() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-slate-100 flex items-center justify-center px-5 py-16">
        <div className="bg-white rounded-[2rem] shadow-xl p-10 max-w-2xl w-full text-center">
          <h1 className="text-8xl font-black text-orange-600">404</h1>

          <h2 className="text-4xl font-black mt-4">Page Not Found</h2>

          <p className="text-gray-500 mt-4">
            The page you are looking for does not exist or has been moved.
          </p>

          <div className="grid sm:grid-cols-2 gap-4 mt-8">
            <Link
              to="/"
              className="bg-black text-white py-4 rounded-full font-black flex items-center justify-center gap-2"
            >
              <Home size={20} />
              Go Home
            </Link>

            <Link
              to="/shop"
              className="bg-orange-600 text-white py-4 rounded-full font-black flex items-center justify-center gap-2"
            >
              <ShoppingBag size={20} />
              Continue Shopping
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}