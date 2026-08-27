import Hero from '../components/home/Hero'
import AboutPreview from '../components/home/AboutPreview'
import Skills from '../components/home/Skills'
import Experience from '../components/home/Experience'
import FeaturedProjects from '../components/home/FeaturedProjects'
import LatestPosts from '../components/home/LatestPosts'
import ContactCTA from '../components/home/ContactCTA'

function HomePage() {
  return (
    <>
      <Hero />
      <AboutPreview />
      <Skills />
      <Experience />
      <FeaturedProjects />
      <LatestPosts />
      <ContactCTA />
    </>
  )
}

export default HomePage