import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import Hero from "../components/Hero";
import FlashSale from "../components/FlashSale";
import FeaturedProducts from "../components/FeaturedProducts";
import TrendingProducts from "../components/TrendingProducts";

export default function Home() {
  return (
    <>
      <Navbar />

      <main>
        <Hero />
        <FlashSale />
        <FeaturedProducts />
        <TrendingProducts />
      </main>

      <Footer />
    </>
  );
}