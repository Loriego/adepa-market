import { PaystackButton } from "react-paystack";
import toast from "react-hot-toast";

export default function PayButton({ email, amount, metadata, onSuccess, disabled = false }) {
  const publicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || "pk_test_2b47193f4559fc4cb498e126a64e5bec923fe0b0";

  const componentProps = {
    email,
    amount: Number(amount) * 100,
    currency: "GHS",
    metadata,
    publicKey,
    text: disabled ? "Complete delivery details" : "Pay securely",
    disabled,
    onSuccess: (reference) => onSuccess(reference),
    onClose: () => toast("Payment window closed."),
  };

  return (
    <div className="mt-5">
      <PaystackButton
        {...componentProps}
        className={`w-full py-3.5 rounded-xl text-sm font-extrabold transition ${disabled ? "bg-white/10 text-gray-500 cursor-not-allowed" : "bg-orange-600 hover:bg-orange-500 text-white shadow-lg shadow-orange-950/20"}`}
      />
    </div>
  );
}
