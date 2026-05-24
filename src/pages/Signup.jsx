import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import { useAuth } from "../context/AuthContext";

export default function Signup() {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    await signup(form.email, form.password);

    navigate("/");
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-slate-100 flex items-center justify-center px-5 py-10">
        <form
          onSubmit={handleSignup}
          className="bg-white rounded-[2rem] p-10 shadow-xl w-full max-w-md"
        >
          <p className="text-orange-600 font-black mb-2">
            Join Adepa Market
          </p>

          <h1 className="text-4xl font-black mb-8">
            Create Account
          </h1>

          <div className="grid gap-5">
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email Address"
              className="border p-4 rounded-xl"
              required
            />

            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              className="border p-4 rounded-xl"
              required
            />

            <button className="bg-orange-600 text-white py-4 rounded-full font-black">
              Create Account
            </button>
          </div>

          <p className="mt-6 text-gray-500">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-orange-600 font-bold"
            >
              Login
            </Link>
          </p>
        </form>
      </main>

      <Footer />
    </>
  );
}