import { CheckCircle, Clock, PackageCheck, Truck, XCircle } from "lucide-react";

export default function OrderTimeline({ status }) {
  const steps = [
    { name: "Pending", icon: Clock },
    { name: "Processing", icon: PackageCheck },
    { name: "Out for Delivery", icon: Truck },
    { name: "Delivered", icon: CheckCircle },
  ];

  if (status === "Cancelled") {
    return (
      <div className="bg-red-50 text-red-700 rounded-2xl p-5 flex items-center gap-3 font-black">
        <XCircle />
        Order Cancelled
      </div>
    );
  }

  const currentIndex = steps.findIndex((step) => step.name === status);

  return (
    <div className="grid sm:grid-cols-4 gap-4">
      {steps.map((step, index) => {
        const Icon = step.icon;
        const active = index <= currentIndex && currentIndex !== -1;

        return (
          <div
            key={step.name}
            className={`rounded-2xl p-4 border ${
              active
                ? "bg-orange-600 text-white border-orange-600"
                : "bg-white text-gray-400 border-gray-200"
            }`}
          >
            <Icon className="mb-2" />
            <p className="font-black">{step.name}</p>
          </div>
        );
      })}
    </div>
  );
}