import { Link } from "react-router-dom";

export default function BecomeVendor() {
  return (
    <section className="py-20 bg-orange-600 text-white text-center">
      <div className="max-w-4xl mx-auto px-5">

        <h2 className="text-5xl font-black">
          Start Selling On Adepa Market
        </h2>

        <p className="mt-5 text-xl">
          Join thousands of vendors and grow your business online.
        </p>

        <Link
          to="/vendor"
          className="inline-block mt-8 bg-black px-8 py-4 rounded-full font-black"
        >
          Become A Vendor
        </Link>

      </div>
    </section>
  );
}