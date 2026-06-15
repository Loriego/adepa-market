import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import HeroSlider from "../components/HeroSlider";

import Categories from "../components/Categories";
import MarketplaceStats from "../components/MarketplaceStats";

import FlashSale from "../components/FlashSale";
import SponsoredProducts from "../components/SponsoredProducts";

import FeaturedProducts from "../components/FeaturedProducts";

import FeaturedVendors from "../components/FeaturedVendors";

import CustomerReviews from "../components/CustomerReviews";
import TrustSection from "../components/TrustSection";

import TrendingProducts from "../components/TrendingProducts";

import BecomeVendor from "../components/BecomeVendor";

export default function Home() {
  return (
    <>
      <Navbar />

      <main>
        <HeroSlider />

        <Categories />

        <MarketplaceStats />

        <FlashSale />

        <SponsoredProducts />

        <FeaturedProducts />

        <FeaturedVendors />

        <CustomerReviews />

        <TrustSection />

        <TrendingProducts />

        <BecomeVendor />
      </main>

      <Footer />
    </>
  );
}