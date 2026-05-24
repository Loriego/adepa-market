import { MessageCircle } from "lucide-react";

export default function FloatingWhatsApp() {
  const phoneNumber = "233247440127";

  const message = encodeURIComponent(
    "Hello Adepa Market, I need help with shopping."
  );

  return (
    <a
      href={`https://wa.me/${phoneNumber}?text=${message}`}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-24 left-6 z-[80] bg-green-600 text-white w-16 h-16 rounded-full shadow-2xl flex items-center justify-center hover:bg-green-700 active:scale-95 transition"
    >
      <MessageCircle size={30} />
    </a>
  );
}