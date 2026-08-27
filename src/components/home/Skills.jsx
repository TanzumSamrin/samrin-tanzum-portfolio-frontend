import { useQuery } from '@tanstack/react-query'
import api from '../../api/axios'
import Skeleton from '../ui/Skeleton'

function Skills() {
  const { data: skillsData, isLoading } = useQuery({
    queryKey: ['skills'],
    queryFn: async () => {
      const response = await api.get('/skills/')
      // Handle both paginated and plain array responses
      return Array.isArray(response.data) ? response.data : response.data.results || []
    },
  })

  if (isLoading) {
    return (
      <section className="section">
        <div className="container-page">
          <Skeleton className="h-8 w-40 mb-10" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        </div>
      </section>
    )
  }

  const skills = skillsData || []
  if (!skills.length) return null

  // Group by category
  const grouped = skills.reduce((acc, skill) => {
    const cat = skill.category || 'OTHER'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(skill)
    return acc
  }, {})

  const categoryLabel = (cat) =>
    cat
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(/\b\w/g, (c) => c.toUpperCase())

  return (
    <section className="section border-t border-[var(--border)]">
      <div className="container-page">
        <p className="font-mono text-sm text-accent mb-3">
          <span className="text-[var(--text-muted)]">//</span> skills
        </p>
        <h2 className="text-2xl sm:text-3xl font-mono font-semibold text-[var(--text)] mb-10">
          Skills
        </h2>

        <div className="space-y-10">
          {Object.entries(grouped).map(([category, items]) => (
            <div key={category}>
              <h3 className="font-mono text-sm text-[var(--text-muted)] mb-4 uppercase tracking-wider">
                {categoryLabel(category)}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {items.map((skill) => (
                  <div
                    key={skill.id}
                    className="card flex items-center justify-between gap-4 py-4"
                  >
                    <span className="font-mono text-sm text-[var(--text)]">
                      {skill.name}
                    </span>
                    <div className="flex items-center gap-2 min-w-[80px]">
                      <div className="flex-1 h-1.5 rounded-full bg-[var(--border)] overflow-hidden">
                        <div
                          className="h-full rounded-full bg-accent"
                          style={{ width: `${Math.min(skill.proficiency || 0, 100)}%` }}
                        />
                      </div>
                      <span className="font-mono text-xs text-[var(--text-muted)] w-8 text-right">
                        {skill.proficiency || 0}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Skills