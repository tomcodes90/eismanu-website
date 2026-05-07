import { HeroSection } from '@/components/sections/HeroSection'
import { IceCreamSection } from '@/components/sections/IceCreamSection'
import { ReservationSection } from '@/components/sections/ReservationSection'
import { MenuSection } from '@/components/sections/MenuSection'
import { AboutSection } from '@/components/sections/AboutSection'
import { NewsSection } from '@/components/sections/NewsSection'
import { getNewsPosts } from '@/sanity/lib/queries'

export default async function HomePage() {
  const newsPosts = await getNewsPosts()

  return (
    <>
      <HeroSection />
      <NewsSection posts={newsPosts} />
      <AboutSection />
      <IceCreamSection />
      <MenuSection />
      <ReservationSection />
    </>
  )
}
