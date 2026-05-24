import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import PaystackPop from "@paystack/inline-js";
import toast from "react-hot-toast";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { db } from "../firebase/firebaseConfig";
import { useCart } from "../context/CartContext";

export default function Checkout() {
  const navigate = useNavigate();
  const { cartItems, totalPrice, clearCart } = useCart();

  const deliveryOptions = {
    Accra: 40,
    Tema: 50,
    Kasoa: 55,
    Kumasi: 80,
    Takoradi: 90,
    Tamale: 120,
    "Other Region": 100,
  };

  const [loading, setLoading] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState("");

  const [customer, setCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    city: "Accra",
    location: "",
  });

  const deliveryFee = deliveryOptions[customer.city] || 100;
  const finalTotal = totalPrice + deliveryFee - discount;

  const coupons = {
    ADEPA10: 10,
    GHANA20: 20,
    WELCOME5: 5,
  };

  const handleChange = (e) => {
    setCustomer({
      ...customer,
      [e.target.name]: e.target.value,
    });
  };

  const applyCoupon = () => {
    const code = couponCode.trim().toUpperCase();

    if (!coupons[code]) {
      toast.error("Invalid coupon code");
      setDiscount(0);
      setAppliedCoupon("");
      return;
    }

    const discountPercent = coupons[code];
    const discountAmount = Math.round((totalPrice * discountPercent) / 100);

    setDiscount(discountAmount);
    setAppliedCoupon(code);

    toast.success(`${discountPercent}% coupon applied`);
  };

  const payWithPaystack = (e) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      toast.error("Cart is empty");
      return;
    }

    setLoading(true);

    const paystack = new PaystackPop();

    paystack.newTransaction({
      key: "pk_test_2b47193f4559fc4cb498e126a64e5bec923fe0b0",
      email: customer.email,
      amount: finalTotal * 100,
      currency: "GHS",
      firstname: customer.name,

      onSuccess: async (transaction) => {
        try {
          const orderData = {
            customer,
            items: cartItems,
            subtotal: totalPrice,
            deliveryFee,
            deliveryCity: customer.city,
            discount,
            coupon: appliedCoupon,
            total: finalTotal,
            paymentStatus: "Paid",
            deliveryStatus: "Pending",
            transactionReference: transaction.reference,
            createdAt: serverTimestamp(),
          };

          await addDoc(collection(db, "orders"), orderData);

          toast.success("Payment successful. Order saved.");
          clearCart();

          navigate("/order-success", {
            state: {
              order: {
                ...orderData,
                createdAt: new Date().toISOString(),
              },
            },
          });
        } catch (error) {
          console.log(error);
          toast.error("Payment done, but order was not saved.");
        }

        setLoading(false);
      },

      onCancel: () => {
        toast.error("Payment cancelled");
        setLoading(false);
      },
    });
  };

  return (
    <>
      <Navbar />

      <main className="max-w-6xl mx-auto px-5 py-12">
        <h1 className="text-5xl font-black mb-10">Checkout</h1>

        <div className="grid lg:grid-cols-2 gap-10">
          <form
            onSubmit={payWithPaystack}
            className="bg-white rounded-3xl p-8 shadow-sm"
          >
            <h2 className="text-3xl font-black mb-6">Customer Details</h2>

            <div className="grid gap-5">
              <input
                name="name"
                value={customer.name}
                onChange={handleChange}
                className="border p-4 rounded-xl"
                placeholder="Full Name"
                required
              />

              <input
                name="email"
                value={customer.email}
                onChange={handleChange}
                className="border p-4 rounded-xl"
                placeholder="Email Address"
                type="email"
                required
              />

              <input
                name="phone"
                value={customer.phone}
                onChange={handleChange}
                className="border p-4 rounded-xl"
                placeholder="Phone / WhatsApp Number"
                required
              />

              <select
                name="city"
                value={customer.city}
                onChange={handleChange}
                className="border p-4 rounded-xl"
                required
              >
                {Object.keys(deliveryOptions).map((city) => (
                  <option key={city} value={city}>
                    {city} — GH₵ {deliveryOptions[city]}
                  </option>
                ))}
              </select>

              <textarea
                name="location"
                value={customer.location}
                onChange={handleChange}
                className="border p-4 rounded-xl h-32"
                placeholder="Detailed delivery address / GhanaPost GPS"
                required
              ></textarea>

              <div className="bg-orange-50 rounded-2xl p-5">
                <p className="font-black mb-3">Have a coupon?</p>

                <div className="flex gap-3">
                  <input
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="border p-4 rounded-xl flex-1"
                    placeholder="Enter coupon code"
                  />

                  <button
                    type="button"
                    onClick={applyCoupon}
                    className="bg-black text-white px-5 rounded-xl font-black"
                  >
                    Apply
                  </button>
                </div>

                {appliedCoupon && (
                  <p className="text-green-600 font-bold mt-3">
                    Coupon applied: {appliedCoupon}
                  </p>
                )}
              </div>

              <button
                disabled={loading}
                className="bg-orange-600 text-white py-4 rounded-full font-black"
              >
                {loading ? "Processing..." : `Pay GH₵ ${finalTotal}`}
              </button>
            </div>
          </form>

          <div className="bg-black text-white rounded-3xl p-8 h-fit">
            <h2 className="text-3xl font-black mb-6">Order Summary</h2>

            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between gap-5">
                  <span>
                    {item.name} x {item.quantity}
                  </span>
                  <span>GH₵ {item.price * item.quantity}</span>
                </div>
              ))}

              <hr className="border-gray-700" />

              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>GH₵ {totalPrice}</span>
              </div>

              <div className="flex justify-between">
                <span>Delivery to {customer.city}</span>
                <span>GH₵ {deliveryFee}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-green-400">
                  <span>Discount</span>
                  <span>- GH₵ {discount}</span>
                </div>
              )}

              <div className="flex justify-between text-2xl font-black pt-4">
                <span>Total</span>
                <span>GH₵ {finalTotal}</span>
              </div>
            </div>

            <div className="mt-8 bg-white/10 rounded-2xl p-5">
              <p className="font-black mb-2">Delivery Fees</p>
              {Object.entries(deliveryOptions).map(([city, fee]) => (
                <p key={city}>
                  {city}: GH₵ {fee}
                </p>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}