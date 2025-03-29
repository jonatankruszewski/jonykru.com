import AboutSection from "@/components/AboutSection";
import Navbar from "@/components/Navbar";
import PublicationsSection from "@/components/PublicationsSection";
import EmailSection from "@/components/EmailSection";
import Footer from "@/components/Footer";
import CertificationsSection from "@/components/CertificationsSection";
import SectionProvider from "@/context/sectionContext";
import {MediumData} from "@/types/mediumArticles";

const getMediumData = async () => {
    const res = await fetch("https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@jonakrusze", {
        next: { revalidate: 3600 },
    });

    if (!res.ok) {
        return {items: []} satisfies MediumData
    }

    return await res.json() as MediumData;
};

export default async function Home() {
    const mediumData = await getMediumData();

    return (
        <SectionProvider>
            <Navbar/>
            <main
                className="flex min-h-screen flex-col container mx-auto px-4 md:px-6 lg:px-12 py-4 gap-20"
            >
                <AboutSection/>
                <PublicationsSection mediumData={mediumData}/>
                <CertificationsSection/>
                <EmailSection/>
            </main>
            <Footer/>
        </SectionProvider>
    );
}
