import { useState } from "react";
import toast from "react-hot-toast";

export default function SendNotification() {
  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState({
    title: "",
    body: "",
  });

  const handleChange = (e) => {
    setMessage({
      ...message,
      [e.target.name]: e.target.value,
    });
  };

  const sendNotification = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/send-notification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(message),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to send notification");
        setLoading(false);
        return;
      }

      toast.success(`Notification sent to ${data.sent} user(s)`);

      setMessage({
        title: "",
        body: "",
      });
    } catch (error) {
      console.log(error);
      toast.error("Notification server not running");
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-slate-100 px-5 py-10">
      <form
        onSubmit={sendNotification}
        className="max-w-2xl mx-auto bg-white rounded-[2rem] p-8 shadow-xl"
      >
        <p className="text-orange-600 font-black">Adepa Market Admin</p>

        <h1 className="text-4xl font-black mt-2 mb-8">
          Send Push Notification
        </h1>

        <div className="grid gap-5">
          <input
            name="title"
            value={message.title}
            onChange={handleChange}
            placeholder="Notification Title"
            className="border p-5 rounded-2xl"
            required
          />

          <textarea
            name="body"
            value={message.body}
            onChange={handleChange}
            placeholder="Notification Message"
            className="border p-5 rounded-2xl h-36"
            required
          ></textarea>

          <button
            disabled={loading}
            className="bg-orange-600 text-white py-5 rounded-full font-black"
          >
            {loading ? "Sending..." : "Send Notification"}
          </button>
        </div>
      </form>
    </main>
  );
}