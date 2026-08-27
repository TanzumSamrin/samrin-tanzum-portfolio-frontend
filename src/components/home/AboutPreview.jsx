import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import api from '../../api/axios'
import Skeleton from '../ui/Skeleton'

function AboutPreview() {
  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const response = await api.get('/profile/')
      return response.data
    },
  })

  if (isLoading) {
    return (
      <section className="section">
        <div className="container-page">
          <Skeleton className="h-8 w-48 mb-8" />
          <div className="space-y-3 max-w-3xl">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-5/6" />
            <Skeleton className="h-5 w-4/6" />
          </div>
        </div>
      </section>
    )
  }

  if (!profile) return null

  const bio = profile.bio || ''
  const preview = bio.length > 280 ? `${bio.slice(0, 280)}...` : bio

  return (
    <section className="section border-t border-[var(--border)]">
      <div className="container-page">
        <p className="font-mono text-sm text-accent mb-3">
          <span className="text-[var(--text-muted)]">//</span> about
        </p>
        <h2 className="text-2xl sm:text-3xl font-mono font-semibold text-[var(--text)] mb-6">
          About Me
        </h2>

        <p className="text-[var(--text-muted)] text-base sm:text-lg leading-relaxed max-w-3xl mb-6">
          {preview}
        </p>

        <Link
          to="/about"
          className="inline-flex items-center gap-2 font-mono text-sm text-accent hover:underline"
        >
          More about me →
        </Link>
      </div>
    </section>
  )
}

export default AboutPreview