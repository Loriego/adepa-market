import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";

import { useAuth } from "../context/AuthContext";

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login, isAdmin } = useAuth();

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
      const result = await login(form.email, form.password);

      if (result.user.email !== "stallonerouffab@gmail.com") {
        toast.error("You are not allowed to access admin");
        setLoading(false);
        return;
      }

      toast.success("Admin login successful");
      navigate("/admin/dashboard");
    } catch (error) {
      console.log(error);
      toast.error("Invalid admin login");
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-slate-100 flex items-center justify-center px-5">
      <form
        onSubmit={handleLogin}
        className="bg-white w-full max-w-md rounded-[2rem] shadow-2xl p-8 border border-orange-100"
      >
        <div className="flex justify-center mb-6">
          <div className="bg-orange-600 text-white w-20 h-20 rounded-3xl flex items-center justify-center shadow-lg">
            <ShieldCheck size={42} />
          </div>
        </div>

        <p className="text-orange-600 font-black text-center">
          Adepa Market Admin
        </p>

        <h1 className="text-4xl font-black mt-2 mb-8 text-center">
          Admin Login
        </h1>

        <div className="grid gap-5">
          <div className="relative">
            <Mail className="absolute left-5 top-5 text-gray-400" size={20} />

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Admin Email"
              className="w-full border-2 border-gray-200 focus:border-orange-600 p-5 pl-14 rounded-2xl outline-none font-bold bg-slate-50"
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
              placeholder="Admin Password"
              className="w-full border-2 border-gray-200 focus:border-orange-600 p-5 pl-14 rounded-2xl outline-none font-bold bg-slate-50"
              required
            />
          </div>

          <button
            disabled={loading}
            className="bg-orange-600 hover:bg-orange-700 text-white py-5 rounded-full font-black flex justify-center items-center gap-2 transition active:scale-95 shadow-lg cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <ShieldCheck size={20} />
            {loading ? "Checking Access..." : "Login as Admin"}
          </button>
        </div>

        <p className="text-center mt-6 text-gray-500 text-sm">
          Admin access is restricted to approved users only.
        </p>
      </form>
    </main>
  );
}