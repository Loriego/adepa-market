import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function About() {
  return (
    <>
      <Navbar />

      <main className="max-w-5xl mx-auto px-5 py-16">
        <h1 className="text-5xl font-black mb-6">About Adepa Market</h1>
        <p className="text-gray-600 text-lg leading-8">
          Adepa Market is a modern Ghanaian ecommerce platform created to help
          people buy quality products online with ease. We focus on beauty,
          gadgets, home essentials, fashion items, and trending products.
        </p>
      </main>

      <Footer />
    </>
  );
}