import { useQuery } from '@tanstack/react-query'
import api from '../../api/axios'
import Spinner from '../ui/Spinner'
import {
  FaFileAlt,
  FaProjectDiagram,
  FaComments,
  FaEnvelope,
  FaEye,
  FaHeart,
} from 'react-icons/fa'

function DashboardStats() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const response = await api.get('/dashboard/stats/')
      return response.data
    },
  })

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    )
  }

  const statCards = [
    { label: 'Total Posts', value: stats?.total_posts || 0, icon: FaFileAlt, color: 'blue' },
    { label: 'Published', value: stats?.published_posts || 0, icon: FaFileAlt, color: 'green' },
    { label: 'Drafts', value: stats?.draft_posts || 0, icon: FaFileAlt, color: 'yellow' },
    { label: 'Projects', value: stats?.total_projects || 0, icon: FaProjectDiagram, color: 'purple' },
    { label: 'Comments', value: stats?.total_comments || 0, icon: FaComments, color: 'pink' },
    { label: 'Pending Comments', value: stats?.pending_comments || 0, icon: FaComments, color: 'orange' },
    { label: 'Messages', value: stats?.unread_messages || 0, icon: FaEnvelope, color: 'red' },
    { label: 'Total Views', value: stats?.total_views || 0, icon: FaEye, color: 'teal' },
  ]

  const colorClasses = {
    blue: 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
    green: 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400',
    yellow: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400',
    purple: 'bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
    pink: 'bg-pink-100 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400',
    orange: 'bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400',
    red: 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400',
    teal: 'bg-teal-100 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400',
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{card.label}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{card.value}</p>
              </div>
              <div className={`p-3 rounded-full ${colorClasses[card.color]}`}>
                <card.icon size={20} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {stats?.top_posts?.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Top Posts</h2>
          <div className="space-y-3">
            {stats.top_posts.map((post, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">#{index + 1}</span>
                  <span className="text-gray-800 dark:text-gray-200">{post.title}</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-1">
                    <FaEye size={14} /> {post.views_count}
                  </span>
                  <span className="flex items-center gap-1">
                    <FaHeart size={14} /> {post.likes_count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default DashboardStats