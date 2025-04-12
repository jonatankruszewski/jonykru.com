import AboutSection from '@/components/AboutSection'
import Navbar from '@/components/Navbar'
import PublicationsSection from '@/components/PublicationsSection'
import EmailSection from '@/components/EmailSection'
import Footer from '@/components/Footer'
import CertificationsSection from '@/components/CertificationsSection'
import SectionProvider from '@/context/sectionContext'
import { getMediumData } from '@/dataFetchers/medium.dataFetcher'
import { getCredlyData } from '@/dataFetchers/credly.dataFetcher'

export default async function Home() {
  const mediumData = await getMediumData()
  const credlyData = await getCredlyData()

  return (
    <SectionProvider>
      <Navbar />
      <main className="flex min-h-screen flex-col container mx-auto px-4 md:px-6 lg:px-12 py-4 gap-20">
        <AboutSection />
        <PublicationsSection mediumData={mediumData} />
        <CertificationsSection credlyData={credlyData} />
        <EmailSection />
      </main>
      <Footer />
    </SectionProvider>
  )
}
