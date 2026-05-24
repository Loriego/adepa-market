import { motion } from "framer-motion";
import {
  User,
  Mail,
  Shield,
  ShoppingBag,
  Bell,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import PushNotificationButton from "../components/PushNotificationButton";

export default function Account() {
  const { user } = useAuth();

  return (
    <main className="min-h-screen bg-slate-100 px-5 py-10">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[40px] shadow-xl overflow-hidden"
        >
          <div className="bg-gradient-to-r from-orange-600 to-orange-500 p-10 text-white">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <div className="w-28 h-28 rounded-full bg-white/20 backdrop-blur-lg flex items-center justify-center text-5xl font-black">
                {user?.email?.charAt(0).toUpperCase()}
              </div>

              <div>
                <p className="uppercase tracking-widest text-sm font-bold text-white/80">
                  Adepa Market Account
                </p>

                <h1 className="text-4xl md:text-5xl font-black mt-2">
                  Welcome Back
                </h1>

                <p className="text-white/80 mt-3 text-lg">
                  Manage your orders, notifications and account settings.
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 md:p-10">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-slate-100 rounded-3xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-orange-600 text-white w-12 h-12 rounded-2xl flex items-center justify-center">
                    <User />
                  </div>

                  <div>
                    <p className="text-gray-500 font-semibold">
                      Username
                    </p>

                    <h2 className="font-black text-xl">
                      {user?.email?.split("@")[0]}
                    </h2>
                  </div>
                </div>
              </div>

              <div className="bg-slate-100 rounded-3xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-black text-white w-12 h-12 rounded-2xl flex items-center justify-center">
                    <Mail />
                  </div>

                  <div>
                    <p className="text-gray-500 font-semibold">
                      Email Address
                    </p>

                    <h2 className="font-black text-lg break-all">
                      {user?.email}
                    </h2>
                  </div>
                </div>
              </div>

              <div className="bg-slate-100 rounded-3xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-green-600 text-white w-12 h-12 rounded-2xl flex items-center justify-center">
                    <Shield />
                  </div>

                  <div>
                    <p className="text-gray-500 font-semibold">
                      Account Status
                    </p>

                    <h2 className="font-black text-xl text-green-600">
                      Verified
                    </h2>
                  </div>
                </div>
              </div>

              <div className="bg-slate-100 rounded-3xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-blue-600 text-white w-12 h-12 rounded-2xl flex items-center justify-center">
                    <ShoppingBag />
                  </div>

                  <div>
                    <p className="text-gray-500 font-semibold">
                      Shopping Status
                    </p>

                    <h2 className="font-black text-xl">
                      Active Customer
                    </h2>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10 bg-slate-100 rounded-[35px] p-8">
              <div className="flex items-center gap-4 mb-5">
                <div className="bg-orange-600 text-white w-14 h-14 rounded-2xl flex items-center justify-center">
                  <Bell />
                </div>

                <div>
                  <h2 className="text-3xl font-black">
                    Push Notifications
                  </h2>

                  <p className="text-gray-500 mt-1">
                    Get live alerts for orders, deliveries and flash sales.
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <PushNotificationButton />
              </div>
            </div>

            <div className="mt-10 bg-black rounded-[35px] p-8 text-white">
              <h2 className="text-3xl font-black mb-4">
                Premium Shopping Experience
              </h2>

              <p className="text-white/70 leading-8 text-lg">
                Adepa Market is built to give you a world-class
                ecommerce experience with live tracking,
                smart recommendations, real-time alerts and
                ultra-fast shopping.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}