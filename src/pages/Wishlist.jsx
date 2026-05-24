import { Heart, Trash2 } from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";

export default function Wishlist() {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-slate-100 px-5 py-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Heart className="text-red-500" />
            <h1 className="text-5xl font-black">Wishlist</h1>
          </div>

          {wishlist.length === 0 ? (
            <div className="bg-white rounded-[2rem] p-10">
              <p className="text-gray-500">No wishlist items yet.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8">
              {wishlist.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-[2rem] overflow-hidden shadow-sm"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-72 w-full object-cover"
                  />

                  <div className="p-5">
                    <p className="text-orange-600 font-bold">
                      {product.category}
                    </p>

                    <h2 className="text-2xl font-black mt-2">
                      {product.name}
                    </h2>

                    <p className="text-3xl font-black mt-4">
                      GH₵ {product.price}
                    </p>

                    <div className="grid gap-3 mt-5">
                      <button
                        onClick={() => addToCart(product)}
                        className="bg-orange-600 text-white py-3 rounded-full font-black"
                      >
                        Add to Cart
                      </button>

                      <button
                        onClick={() => removeFromWishlist(product.id)}
                        className="bg-red-600 text-white py-3 rounded-full font-black flex items-center justify-center gap-2"
                      >
                        <Trash2 size={18} />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}