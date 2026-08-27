import { useQuery } from '@tanstack/react-query'
import api from '../../api/axios'
import Skeleton from '../ui/Skeleton'

function Experience() {
  const { data: experiences, isLoading } = useQuery({
    queryKey: ['experiences'],
    queryFn: async () => {
      const response = await api.get('/experiences/')
      return response.data
    },
  })

  if (isLoading) {
    return (
      <section className="py-16 bg-gray-50 dark:bg-gray-800/50">
        <div className="container mx-auto px-4">
          <Skeleton className="h-8 w-48 mx-auto mb-12" />
          <div className="space-y-8 max-w-3xl mx-auto">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex gap-4">
                <Skeleton className="w-2 h-2 rounded-full mt-2" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (!experiences?.length) return null

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-800/50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
          Experience
        </h2>
        
        <div className="max-w-3xl mx-auto">
          {experiences.map((exp, index) => (
            <div key={exp.id} className="relative pl-8 pb-8 last:pb-0">
              {index < experiences.length - 1 && (
                <div className="absolute left-2 top-2 bottom-0 w-0.5 bg-primary/30" />
              )}
              <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full bg-primary border-4 border-white dark:border-gray-800" />
              
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex flex-wrap justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {exp.role}
                  </h3>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(exp.start_date).getFullYear()} -{' '}
                    {exp.is_current ? 'Present' : new Date(exp.end_date).getFullYear()}
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-300 font-medium">
                  {exp.company} · {exp.employment_type}
                </p>
                {exp.location && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                    {exp.location}
                  </p>
                )}
                <p className="text-gray-600 dark:text-gray-300">
                  {exp.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Experience