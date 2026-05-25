import { Link } from "react-router-dom";
import { CheckCircle, ShoppingBag } from "lucide-react";

export default function Success() {
  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-5">
      <div className="bg-white text-black rounded-[2rem] p-10 max-w-xl w-full text-center shadow-2xl">
        <CheckCircle className="mx-auto text-green-600 mb-5" size={80} />

        <h1 className="text-4xl font-black">Payment Successful</h1>

        <p className="text-gray-500 mt-4">
          Your order has been placed successfully. Adepa Market will contact you
          for delivery.
        </p>

        <Link
          to="/shop"
          className="mt-8 bg-orange-600 text-white px-8 py-4 rounded-full font-black inline-flex items-center gap-2"
        >
          <ShoppingBag size={20} />
          Continue Shopping
        </Link>
      </div>
    </main>
  );
}