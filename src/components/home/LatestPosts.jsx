import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import api from '../../api/axios'
import Button from '../ui/Button'
import Skeleton from '../ui/Skeleton'

function LatestPosts() {
  const { data: posts, isLoading } = useQuery({
    queryKey: ['posts', 'latest'],
    queryFn: async () => {
      const response = await api.get('/posts/?ordering=-published_at')
      const list = Array.isArray(response.data) ? response.data : response.data.results || []
      return list.slice(0, 3)
    },
  })

  if (isLoading) {
    return (
      <section className="section">
        <div className="container-page">
          <Skeleton className="h-8 w-48 mb-10" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-72 w-full" />
            ))}
          </div>
        </div>
      </section>
    )
  }

  const list = posts || []
  if (!list.length) return null

  return (
    <section className="section border-t border-[var(--border)]">
      <div className="container-page">
        <p className="font-mono text-sm text-accent mb-3">
          <span className="text-[var(--text-muted)]">//</span> blog
        </p>
        <h2 className="text-2xl sm:text-3xl font-mono font-semibold text-[var(--text)] mb-10">
          Latest Posts
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {list.map((post) => (
            <Link
              key={post.id}
              to={`/blog/${post.slug}`}
              className="card group overflow-hidden p-0 flex flex-col"
            >
              {post.cover_image ? (
                <div className="aspect-video overflow-hidden border-b border-[var(--border)]">
                  <img
                    src={post.cover_image}
                    alt={post.title}
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
                <div className="flex items-center gap-2 text-xs font-mono text-[var(--text-muted)] mb-2">
                  {post.category?.name && <span className="badge">{post.category.name}</span>}
                  {post.reading_time && <span>{post.reading_time} min read</span>}
                </div>
                <h3 className="font-mono text-base text-[var(--text)] group-hover:text-accent transition-colors mb-2">
                  {post.title}
                </h3>
                <p className="text-sm text-[var(--text-muted)] line-clamp-2">
                  {post.excerpt}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link to="/blog">
            <Button variant="outline">Read the blog</Button>
          </Link>
        </div>
      </div>
    </section>
  )
}

export default LatestPosts