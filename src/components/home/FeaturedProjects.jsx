import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import api from '../../api/axios'
import Button from '../ui/Button'
import Skeleton from '../ui/Skeleton'

function FeaturedProjects() {
  const { data: projects, isLoading } = useQuery({
    queryKey: ['projects', 'featured'],
    queryFn: async () => {
      const response = await api.get('/projects/?is_featured=true')
      const list = Array.isArray(response.data) ? response.data : response.data.results || []
      return list.slice(0, 3)
    },
  })

  if (isLoading) {
    return (
      <section className="section">
        <div className="container-page">
          <Skeleton className="h-8 w-56 mb-10" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-72 w-full" />
            ))}
          </div>
        </div>
      </section>
    )
  }

  const list = projects || []
  if (!list.length) return null

  return (
    <section className="section border-t border-[var(--border)]">
      <div className="container-page">
        <p className="font-mono text-sm text-accent mb-3">
          <span className="text-[var(--text-muted)]">//</span> projects
        </p>
        <h2 className="text-2xl sm:text-3xl font-mono font-semibold text-[var(--text)] mb-10">
          Featured Projects
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {list.map((project) => (
            <Link
              key={project.id}
              to={`/projects/${project.slug}`}
              className="card group overflow-hidden p-0 flex flex-col"
            >
              {project.cover_image ? (
                <div className="aspect-video overflow-hidden border-b border-[var(--border)]">
                  <img
                    src={project.cover_image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
              ) : (
                <div className="aspect-video bg-[var(--border)] flex items-center justify-center border-b border-[var(--border)]">
                  <span className="font-mono text-[var(--text-muted)] text-sm">No image</span>
                </div>
              )}

              <div className="p-5 flex flex-col flex-1">
                <h3 className="font-mono text-base text-[var(--text)] group-hover:text-accent transition-colors mb-2">
                  {project.title}
                </h3>
                <p className="text-sm text-[var(--text-muted)] line-clamp-2 flex-1">
                  {project.summary || project.description?.slice(0, 100)}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link to="/projects">
            <Button variant="outline">See all projects</Button>
          </Link>
        </div>
      </div>
    </section>
  )
}

export default FeaturedProjects