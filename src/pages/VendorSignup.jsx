import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import toast from "react-hot-toast";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { db } from "../firebase/firebaseConfig";
import { useAuth } from "../context/AuthContext";

export default function VendorSignup() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const [vendor, setVendor] = useState({
    shopName: "",
    ownerName: "",
    phone: "",
    location: "",
    category: "",
  });

  const handleChange = (e) => {
    setVendor({
      ...vendor,
      [e.target.name]: e.target.value,
    });
  };

  const submitVendor = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("Login first before becoming a vendor");
      return;
    }

    setLoading(true);

    try {
      await addDoc(collection(db, "vendors"), {
        ...vendor,
        email: user.email,
        userId: user.uid,
        status: "Pending",
        createdAt: serverTimestamp(),
      });

      toast.success("Vendor application submitted");

      setVendor({
        shopName: "",
        ownerName: "",
        phone: "",
        location: "",
        category: "",
      });
    } catch (error) {
      console.log(error);
      toast.error("Failed to submit vendor application");
    }

    setLoading(false);
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-slate-100 px-5 py-12">
        <form
          onSubmit={submitVendor}
          className="max-w-3xl mx-auto bg-white rounded-[2rem] p-8 shadow-xl"
        >
          <p className="text-orange-600 font-black">Sell on Adepa Market</p>

          <h1 className="text-4xl md:text-5xl font-black mt-2 mb-8">
            Vendor Registration
          </h1>

          <div className="grid gap-5">
            <input
              name="shopName"
              value={vendor.shopName}
              onChange={handleChange}
              placeholder="Shop / Business Name"
              className="border p-5 rounded-2xl"
              required
            />

            <input
              name="ownerName"
              value={vendor.ownerName}
              onChange={handleChange}
              placeholder="Owner Full Name"
              className="border p-5 rounded-2xl"
              required
            />

            <input
              name="phone"
              value={vendor.phone}
              onChange={handleChange}
              placeholder="Phone / WhatsApp"
              className="border p-5 rounded-2xl"
              required
            />

            <input
              name="location"
              value={vendor.location}
              onChange={handleChange}
              placeholder="Shop Location"
              className="border p-5 rounded-2xl"
              required
            />

            <input
              name="category"
              value={vendor.category}
              onChange={handleChange}
              placeholder="Main Product Category"
              className="border p-5 rounded-2xl"
              required
            />

            <button
              disabled={loading}
              className="bg-orange-600 hover:bg-black transition text-white py-5 rounded-full font-black active:scale-95"
            >
              {loading ? "Submitting..." : "Apply as Vendor"}
            </button>
          </div>
        </form>
      </main>

      <Footer />
    </>
  );
}