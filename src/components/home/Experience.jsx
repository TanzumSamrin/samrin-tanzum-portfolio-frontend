import { useQuery } from '@tanstack/react-query'
import api from '../../api/axios'
import Skeleton from '../ui/Skeleton'

function Experience() {
  const { data: experiences, isLoading } = useQuery({
    queryKey: ['experiences'],
    queryFn: async () => {
      const response = await api.get('/experiences/')
      return Array.isArray(response.data) ? response.data : response.data.results || []
    },
  })

  if (isLoading) {
    return (
      <section className="section">
        <div className="container-page">
          <Skeleton className="h-8 w-48 mb-10" />
          <div className="space-y-6">
            {[...Array(2)].map((_, i) => (
              <Skeleton key={i} className="h-28 w-full" />
            ))}
          </div>
        </div>
      </section>
    )
  }

  const list = experiences || []
  if (!list.length) return null

  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  }

  return (
    <section className="section border-t border-[var(--border)]">
      <div className="container-page">
        <p className="font-mono text-sm text-accent mb-3">
          <span className="text-[var(--text-muted)]">//</span> experience
        </p>
        <h2 className="text-2xl sm:text-3xl font-mono font-semibold text-[var(--text)] mb-10">
          Experience
        </h2>

        <div className="relative border-l border-[var(--border)] ml-3 space-y-10">
          {list.map((exp) => (
            <div key={exp.id} className="relative pl-8">
              {/* Timeline dot */}
              <span className="absolute left-0 top-1.5 -translate-x-1/2 w-3 h-3 rounded-full bg-accent border-2 border-[var(--bg)]" />

              <div className="card">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-2">
                  <h3 className="font-mono text-base text-[var(--text)]">
                    {exp.role || exp.position}
                  </h3>
                  <span className="font-mono text-xs text-[var(--text-muted)]">
                    {formatDate(exp.start_date)}
                    {' — '}
                    {exp.is_current ? 'Present' : formatDate(exp.end_date)}
                  </span>
                </div>

                <p className="text-sm text-accent mb-3">
                  {exp.company}
                  {exp.location ? ` · ${exp.location}` : ''}
                </p>

                {exp.description && (
                  <p className="text-sm text-[var(--text-muted)] leading-relaxed whitespace-pre-line">
                    {exp.description.length > 200
                      ? `${exp.description.slice(0, 200)}...`
                      : exp.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Experience