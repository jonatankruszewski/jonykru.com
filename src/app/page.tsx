import HeroSection from "@/components/HeroSection";
import Navbar from "@/components/Navbar";
import PublicationsSection from "@/components/PublicationsSection";
import EmailSection from "@/components/EmailSection";
import Footer from "@/components/Footer";
import AchievementsSection from "@/components/AchievementsSection";
import CertificationsSection from "@/components/CertificationsSection";
import AboutMeCardsSection from "@/components/AboutMeCardsSection";

export default function Home() {
    return (
        <>
            <Navbar/>
            <main className="flex min-h-screen flex-col bg-[#121212]">
                <div className="container mt-24 mx-auto px-12 py-4">
                    <HeroSection/>
                    <AchievementsSection/>
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
