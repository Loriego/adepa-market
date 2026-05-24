import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, LogIn } from "lucide-react";
import toast from "react-hot-toast";

import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [loading, setLoading] = useState(false);

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

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(form.email, form.password);
      navigate("/");
    } catch (error) {
      console.log(error);
      toast.error("Invalid email or password");
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 to-white flex items-center justify-center px-5">
      <form
        onSubmit={handleLogin}
        className="bg-white w-full max-w-md rounded-[2rem] shadow-2xl p-8"
      >
        <p className="text-orange-600 font-black">Adepa Market</p>

        <h1 className="text-4xl font-black mt-2 mb-8">Customer Login</h1>

        <div className="grid gap-5">
          <div className="relative">
            <Mail className="absolute left-5 top-5 text-gray-400" size={20} />
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email Address"
              className="w-full border-2 border-gray-200 focus:border-orange-600 p-5 pl-14 rounded-2xl outline-none font-bold"
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-5 top-5 text-gray-400" size={20} />
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full border-2 border-gray-200 focus:border-orange-600 p-5 pl-14 rounded-2xl outline-none font-bold"
              required
            />
          </div>

          <button
            disabled={loading}
            className="bg-orange-600 hover:bg-orange-700 text-white py-5 rounded-full font-black flex justify-center items-center gap-2 transition active:scale-95 shadow-lg cursor-pointer"
          >
            <LogIn size={20} />
            {loading ? "Logging in..." : "Login"}
          </button>
        </div>

        <p className="text-center mt-6 text-gray-500">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-orange-600 font-black">
            Signup
          </Link>
        </p>
      </form>
    </main>
  );
}