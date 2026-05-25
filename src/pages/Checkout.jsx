import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ShoppingBag,
  Truck,
  ShieldCheck,
} from "lucide-react";

import PayButton from "../components/PaystackButton";
import { useCart } from "../context/CartContext";

export default function Checkout() {
  const { cartItems, clearCart } = useCart();

  const [customer, setCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    address: "",
  });

  const subtotal = useMemo(() => {
    return cartItems.reduce(
      (acc, item) =>
        acc +
        Number(item.price || 0) *
          Number(item.quantity || 1),
      0
    );
  }, [cartItems]);

  const shipping = subtotal > 0 ? 40 : 0;

  const grandTotal = subtotal + shipping;

  const handleChange = (e) => {
    setCustomer({
      ...customer,
      [e.target.name]: e.target.value,
    });
  };

  const placeOrder = async (reference) => {
    const order = {
      customer,
      items: cartItems,
      paymentReference: reference.reference,
      total: grandTotal,
      paymentStatus: "Paid",
      deliveryStatus: "Processing",
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem(
      "lastOrder",
      JSON.stringify(order)
    );
  };

  if (cartItems.length === 0) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center px-5">
        <div className="text-center">
          <ShoppingBag
            size={80}
            className="mx-auto mb-5 text-orange-500"
          />

          <h1 className="text-4xl font-black">
            Your Cart Is Empty
          </h1>

          <p className="text-gray-400 mt-3">
            Add some products before checkout.
          </p>

          <Link
            to="/shop"
            className="inline-block mt-6 bg-orange-600 px-8 py-4 rounded-full font-bold"
          >
            Go Shopping
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-[#f5f5f5] min-h-screen py-10 px-4">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-8">

        {/* LEFT SIDE */}
        <div className="lg:col-span-2 bg-white rounded-[2rem] p-8 shadow-xl">
          <h1 className="text-4xl font-black mb-8">
            Checkout
          </h1>

          <div className="grid md:grid-cols-2 gap-5">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={customer.name}
              onChange={handleChange}
              className="border border-gray-200 rounded-2xl p-4 outline-none"
            />

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={customer.email}
              onChange={handleChange}
              className="border border-gray-200 rounded-2xl p-4 outline-none"
            />

            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={customer.phone}
              onChange={handleChange}
              className="border border-gray-200 rounded-2xl p-4 outline-none"
            />

            <input
              type="text"
              name="city"
              placeholder="City"
              value={customer.city}
              onChange={handleChange}
              className="border border-gray-200 rounded-2xl p-4 outline-none"
            />
          </div>

          <textarea
            name="address"
            placeholder="Delivery Address"
            value={customer.address}
            onChange={handleChange}
            rows="5"
            className="border border-gray-200 rounded-2xl p-4 outline-none mt-5 w-full"
          />

          {/* FEATURES */}
          <div className="grid md:grid-cols-3 gap-4 mt-8">

            <div className="bg-orange-50 rounded-2xl p-5">
              <Truck className="text-orange-600 mb-3" />

              <h3 className="font-black">
                Fast Delivery
              </h3>

              <p className="text-sm text-gray-500">
                Nationwide delivery across Ghana.
              </p>
            </div>

            <div className="bg-orange-50 rounded-2xl p-5">
              <ShieldCheck className="text-orange-600 mb-3" />

              <h3 className="font-black">
                Secure Payment
              </h3>

              <p className="text-sm text-gray-500">
                MTN MoMo, Vodafone Cash and Cards.
              </p>
            </div>

            <div className="bg-orange-50 rounded-2xl p-5">
              <ShoppingBag className="text-orange-600 mb-3" />

              <h3 className="font-black">
                Trusted Vendors
              </h3>

              <p className="text-sm text-gray-500">
                Verified marketplace sellers.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="bg-black text-white rounded-[2rem] p-8 shadow-2xl h-fit sticky top-10">
          <h2 className="text-3xl font-black mb-8">
            Order Summary
          </h2>

          <div className="space-y-5">
            {cartItems.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center border-b border-gray-800 pb-4"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 rounded-xl object-cover"
                  />

                  <div>
                    <h3 className="font-bold">
                      {item.name}
                    </h3>

                    <p className="text-gray-400 text-sm">
                      Qty: {item.quantity || 1}
                    </p>
                  </div>
                </div>

                <h3 className="font-black text-orange-500">
                  GH₵{" "}
                  {(
                    Number(item.price || 0) *
                    Number(item.quantity || 1)
                  ).toFixed(2)}
                </h3>
              </div>
            ))}
          </div>

          {/* TOTALS */}
          <div className="mt-8 space-y-4">

            <div className="flex justify-between text-gray-400">
              <span>Subtotal</span>

              <span>
                GH₵ {subtotal.toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between text-gray-400">
              <span>Delivery</span>

              <span>
                GH₵ {shipping.toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between text-2xl font-black border-t border-gray-700 pt-5">
              <span>Total</span>

              <span className="text-orange-500">
                GH₵ {grandTotal.toFixed(2)}
              </span>
            </div>
          </div>

          {/* PAYMENT */}
          <PayButton
            email={
              customer.email ||
              "customer@adepamarket.com"
            }
            amount={grandTotal}
            metadata={{
              custom_fields: [
                {
                  display_name: "Customer Name",
                  variable_name: "customer_name",
                  value:
                    customer.name || "Customer",
                },

                {
                  display_name: "Phone",
                  variable_name: "phone",
                  value:
                    customer.phone || "N/A",
                },
              ],
            }}
            onSuccess={async (reference) => {
              await placeOrder(reference);

              clearCart();

              alert("Payment Successful!");

              window.location.href =
                "/success";
            }}
          />

          <p className="text-center text-gray-500 text-sm mt-5">
            Secure payments powered by Paystack
          </p>
        </div>
      </div>
    </main>
  );
}