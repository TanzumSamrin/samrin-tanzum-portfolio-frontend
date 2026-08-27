import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import api from '../../api/axios'
import Button from '../ui/Button'
import Skeleton from '../ui/Skeleton'
import { FaGithub, FaLinkedin, FaTwitter, FaEnvelope } from 'react-icons/fa'

function Hero() {
  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const response = await api.get('/profile/')
      return response.data
    },
  })

  if (isLoading) {
    return (
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 space-y-4">
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-20 w-full" />
              <div className="flex gap-4">
                <Skeleton className="h-12 w-32" />
                <Skeleton className="h-12 w-32" />
              </div>
            </div>
            <Skeleton className="w-64 h-64 rounded-full" />
          </div>
        </div>
      </section>
    )
  }

  if (!profile) return null

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-4">
              Hi, I'm <span className="text-primary">{profile.full_name}</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-3">{profile.headline}</p>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-lg">{profile.bio}</p>
            
            <div className="flex flex-wrap gap-4">
              <Link to="/projects">
                <Button variant="primary" size="lg">View Projects</Button>
              </Link>
              {profile.resume && (
                <a href={profile.resume} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="lg">Download Resume</Button>
                </a>
              )}
            </div>
            
            <div className="flex gap-4 mt-6">
              {profile.github_url && (
                <a href={profile.github_url} target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">
                  <FaGithub size={24} />
                </a>
              )}
              {profile.linkedin_url && (
                <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">
                  <FaLinkedin size={24} />
                </a>
              )}
              {profile.x_url && (
                <a href={profile.x_url} target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">
                  <FaTwitter size={24} />
                </a>
              )}
              <a href={`mailto:${profile.email}`} className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">
                <FaEnvelope size={24} />
              </a>
            </div>
          </div>
          
          {profile.avatar && (
            <div className="flex-shrink-0">
              <img
                src={profile.avatar}
                alt={profile.full_name}
                className="w-64 h-64 rounded-full object-cover border-4 border-primary/20"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default Hero