import { Star } from "lucide-react";

const reviews = [
  {
    name: "Kwame Asare",
    review:
      "Very fast delivery. My sneakers arrived exactly as shown.",
  },
  {
    name: "Akosua Mensah",
    review:
      "The shopping experience was smooth and secure.",
  },
  {
    name: "Michael Owusu",
    review:
      "Excellent marketplace. I found products cheaper than elsewhere.",
  },
];

export default function CustomerReviews() {
  return (
    <section className="py-20 bg-slate-100">
      <div className="max-w-7xl mx-auto px-5">

        <div className="text-center mb-12">
          <h2 className="text-5xl font-black">
            What Customers Say
          </h2>

          <p className="text-gray-500 mt-4">
            Trusted by shoppers across Ghana
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">

          {reviews.map((review) => (
            <div
              key={review.name}
              className="bg-white rounded-3xl p-8 shadow-lg"
            >
              <div className="flex gap-1 text-orange-500 mb-4">
                <Star fill="currentColor" />
                <Star fill="currentColor" />
                <Star fill="currentColor" />
                <Star fill="currentColor" />
                <Star fill="currentColor" />
              </div>

              <p className="text-gray-600">
                "{review.review}"
              </p>

              <h3 className="font-black mt-5">
                {review.name}
              </h3>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
}