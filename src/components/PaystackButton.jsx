import { PaystackButton } from "react-paystack";

export default function PayButton({
  email,
  amount,
  metadata,
  onSuccess,
}) {
  const publicKey =
    import.meta.env.VITE_PAYSTACK_PUBLIC_KEY ||
    "pk_test_2b47193f4559fc4cb498e126a64e5bec923fe0b0";

  const componentProps = {
    email,
    amount: Number(amount) * 100,
    currency: "GHS",
    metadata,
    publicKey,
    text: "Pay Now",

    onSuccess: (reference) => {
      onSuccess(reference);
    },

    onClose: () => {
      alert("Payment cancelled");
    },
  };

  return (
    <div className="mt-6">
      <PaystackButton
        {...componentProps}
        className="w-full bg-orange-600 hover:bg-orange-700 transition-all duration-300 text-white py-4 rounded-2xl font-black text-lg"
      />
    </div>
  );
}