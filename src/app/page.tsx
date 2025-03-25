import AboutSection from "@/components/AboutSection";
import Navbar from "@/components/Navbar";
import PublicationsSection from "@/components/PublicationsSection";
import EmailSection from "@/components/EmailSection";
import Footer from "@/components/Footer";
import CertificationsSection from "@/components/CertificationsSection";
import SectionProvider from "@/context/sectionContext";

export default function Home() {

    return (
        <SectionProvider>
            <Navbar/>
            <main
                className="flex min-h-screen flex-col bg-[#121212] container mx-auto px-4 md:px-6 lg:px-12 py-4 gap-20">
                <AboutSection/>
                <PublicationsSection/>
                <CertificationsSection/>
                <EmailSection/>
            </main>
            <Footer/>
        </SectionProvider>
    );
}
