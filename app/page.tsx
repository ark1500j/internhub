import AboutSectionOne from "@/components/About/AboutSectionOne";
import Blog from "@/components/Blog";
import ScrollUp from "@/components/Common/ScrollUp";
import Features from "@/components/Features";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Internships from "@/components/Internships";
import Testimonials from "@/components/Testimonials";
import Header from "@/components/header";
import { Metadata } from "next";
import ScrollToTop from "@/components/ScrollToTop";

export const metadata: Metadata = {
  title: "InternHub",
  description: "This is Home for Internship Opportunities",
  // other metadata
};

export default function Home() {
  return (
    <>
    <Header/>
      <ScrollUp />
      <ScrollToTop />
      <Hero />
      <Features />
      <AboutSectionOne />
      <Internships />
      <Testimonials />
      <Blog />
      <Footer/>
    </>
  );
}