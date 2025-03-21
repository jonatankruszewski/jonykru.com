import HeroSection from "@/components/HeroSection";
import Navbar from "@/components/Navbar";
import PublicationsSection from "@/components/PublicationsSection";
import EmailSection from "@/components/EmailSection";
import Footer from "@/components/Footer";
import CertificationsSection from "@/components/CertificationsSection";
import AboutMeCardsSection from "@/components/AboutMeCardsSection";

export default function Home() {
    return (
        <>
            <Navbar/>
            <main className="flex min-h-screen flex-col bg-[#121212]">
                <div className="container mx-auto mt-24 px-4 md:px-6 lg:px-12 py-4 flex flex-col gap-40">
                    <HeroSection/>
                    <AboutMeCardsSection/>
                    <PublicationsSection/>
                    <CertificationsSection/>
                    <EmailSection/>
                </div>
            </main>
            <Footer/>
        </>
    );
}
