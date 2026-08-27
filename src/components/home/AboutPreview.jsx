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
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Skeleton className="h-8 w-48 mx-auto mb-8" />
          <div className="space-y-4 max-w-3xl mx-auto">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-5/6" />
            <Skeleton className="h-6 w-4/6" />
          </div>
        </div>
      </section>
    )
  }

  if (!profile) return null

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-800/50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">About Me</h2>
        <div className="max-w-3xl mx-auto">
          <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
            {profile.bio?.slice(0, 300)}
            {profile.bio?.length > 300 && '...'}
          </p>
          <div className="mt-6 text-center">
            <Link to="/projects" className="text-primary hover:underline font-semibold">
              More about me →
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutPreview