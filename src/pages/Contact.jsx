import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Contact() {
  return (
    <>
      <Navbar />

      <main className="max-w-4xl mx-auto px-5 py-16">
        <h1 className="text-5xl font-black mb-6">Contact Us</h1>

        <div className="bg-white rounded-3xl p-8 shadow-sm grid gap-5">
          <input className="border p-4 rounded-xl" placeholder="Your Name" />
          <input className="border p-4 rounded-xl" placeholder="Email or Phone" />
          <textarea
            className="border p-4 rounded-xl h-40"
            placeholder="Message"
          ></textarea>

          <button className="bg-orange-600 text-white py-4 rounded-full font-black">
            Send Message
          </button>
        </div>
      </main>

      <Footer />
    </>
  );
}