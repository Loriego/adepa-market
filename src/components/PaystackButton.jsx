import React from "react";
import { PaystackButton } from "react-paystack";

export default function PayButton({ email, amount, onSuccess }) {
  const publicKey = "pk_test_2b47193f4559fc4cb498e126a64e5bec923fe0b0";

  const componentProps = {
    email,
    amount: amount * 100,
    publicKey,
    text: "Pay Now",
    onSuccess: (reference) => {
      console.log(reference);
      onSuccess(reference);
    },
    onClose: () => {
      alert("Payment cancelled");
    },
  };

  return (
    <PaystackButton
      {...componentProps}
      className="pay-btn"
    />
  );
}