import AboutSectionOne from "@/components/About/AboutSectionOne";
import Breadcrumb from "@/components/Common/Breadcrumb";
import Footer from "@/components/Footer";
import Header from "@/components/header";


const AboutPage = () => {
  return (
    <>
    <Header/>
      <Breadcrumb
        pageName="About InternHub"
        description="Internhub was founded in 2023 by a group of passionate educators and industry professionals who recognized the need for a more efficient and inclusive way to connect students with internship opportunities. Our platform was built to bridge the gap between academic learning and professional experience, ensuring students are well-prepared for the workforce."
      />
      <AboutSectionOne />
      <Footer/>
    </>
  );
};

export default AboutPage;
