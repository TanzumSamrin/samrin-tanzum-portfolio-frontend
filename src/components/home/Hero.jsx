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
      <section className="section bg-grid">
        <div className="container-page">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 space-y-4">
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-20 w-full" />
              <div className="flex gap-4">
                <Skeleton className="h-12 w-36" />
                <Skeleton className="h-12 w-36" />
              </div>
            </div>
            <Skeleton className="w-64 h-64 rounded-md" />
          </div>
        </div>
      </section>
    )
  }

  if (!profile) return null

  const name = profile.full_name || profile.name || 'Samrin Tanzum'
  const headline = profile.headline || 'Full-Stack Developer'
  const bio = profile.bio || ''
  const avatar = profile.avatar || profile.profile_image

  return (
    <section className="section bg-grid relative overflow-hidden">
      <div className="container-page relative z-10">
        <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-16">
          {/* Text content */}
          <div className="flex-1 text-center md:text-left">
            <p className="font-mono text-sm text-accent mb-3">
              <span className="text-[var(--text-muted)]">$</span> whoami
            </p>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-mono font-semibold text-[var(--text)] mb-4">
              {name}
            </h1>

            <p className="text-lg sm:text-xl text-accent font-mono mb-4">
              {headline}
            </p>

            <p className="text-[var(--text-muted)] max-w-xl mb-8 leading-relaxed">
              {bio.length > 220 ? `${bio.slice(0, 220)}...` : bio}
            </p>

            <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-8">
              <Link to="/projects">
                <Button variant="primary" size="md">
                  View Projects
                </Button>
              </Link>

              {profile.resume && (
                <a href={profile.resume} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="md">
                    Download Resume
                  </Button>
                </a>
              )}
            </div>

            {/* Social icons */}
            <div className="flex justify-center md:justify-start gap-4">
              {profile.github_url && (
                <a
                  href={profile.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--text-muted)] hover:text-accent transition-colors"
                  aria-label="GitHub"
                >
                  <FaGithub size={22} />
                </a>
              )}
              {profile.linkedin_url && (
                <a
                  href={profile.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--text-muted)] hover:text-accent transition-colors"
                  aria-label="LinkedIn"
                >
                  <FaLinkedin size={22} />
                </a>
              )}
              {(profile.x_url || profile.twitter_url) && (
                <a
                  href={profile.x_url || profile.twitter_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--text-muted)] hover:text-accent transition-colors"
                  aria-label="X / Twitter"
                >
                  <FaTwitter size={22} />
                </a>
              )}
              {profile.email && (
                <a
                  href={`mailto:${profile.email}`}
                  className="text-[var(--text-muted)] hover:text-accent transition-colors"
                  aria-label="Email"
                >
                  <FaEnvelope size={22} />
                </a>
              )}
            </div>
          </div>

          {/* Avatar / illustration */}
          <div className="flex-shrink-0">
            {avatar ? (
              <div className="relative">
                <div className="absolute -inset-1 rounded-md bg-accent/20 blur-sm" />
                <img
                  src={avatar}
                  alt={name}
                  className="relative w-56 h-56 sm:w-64 sm:h-64 object-cover rounded-md border border-[var(--border)]"
                />
              </div>
            ) : (
              <div className="w-56 h-56 sm:w-64 sm:h-64 rounded-md border border-[var(--border)] bg-[var(--surface)] flex items-center justify-center">
                <span className="font-mono text-accent text-4xl">
                  {name.charAt(0)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero