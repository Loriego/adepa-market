import { useState } from "react";
import { getToken, onMessage } from "firebase/messaging";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import toast from "react-hot-toast";
import { Bell, CheckCircle } from "lucide-react";

import { db, getFirebaseMessaging } from "../firebase/firebaseConfig";
import { useAuth } from "../context/AuthContext";

export default function PushNotificationButton() {
  const { user } = useAuth();
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(false);

  const enableNotifications = async () => {
    if (!user) {
      toast.error("Login first");
      return;
    }

    setLoading(true);

    try {
      const permission = await Notification.requestPermission();

      if (permission !== "granted") {
        toast.error("Notification permission denied");
        setLoading(false);
        return;
      }

      const messaging = await getFirebaseMessaging();

      if (!messaging) {
        toast.error("Push notifications not supported");
        setLoading(false);
        return;
      }

      const token = await getToken(messaging, {
        vapidKey:
          "BKTQT8rmR9MVBdnHdBQbz3jlkI2ZqZ9l1ZtqmCzgd8IlD9CMVjTAw4EeW_I8lToxNZ7yR8b5PTtSwNPqLfhkT_w",
      });

      if (!token) {
        toast.error("Could not generate token");
        setLoading(false);
        return;
      }

      await setDoc(doc(db, "notificationTokens", user.uid), {
        email: user.email,
        token,
        createdAt: serverTimestamp(),
      });

      setEnabled(true);
      toast.success("Push alerts enabled");

      onMessage(messaging, (payload) => {
        toast.success(payload.notification?.title || "New notification");
      });
    } catch (error) {
      console.log(error);
      toast.error("Failed to enable notifications");
    }

    setLoading(false);
  };

  return (
    <button
      onClick={enableNotifications}
      disabled={loading || enabled}
      className={`px-6 py-4 rounded-full font-black flex items-center gap-2 transition active:scale-95 shadow-lg ${
        enabled
          ? "bg-green-600 text-white cursor-not-allowed"
          : "bg-orange-600 hover:bg-orange-700 text-white cursor-pointer"
      }`}
    >
      {enabled ? <CheckCircle size={20} /> : <Bell size={20} />}
      {loading ? "Enabling..." : enabled ? "Push Alerts Enabled" : "Enable Push Alerts"}
    </button>
  );
}