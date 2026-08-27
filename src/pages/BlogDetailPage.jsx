import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import api from '../api/axios'
import BlogDetail from '../components/blog/BlogDetail'
import Spinner from '../components/ui/Spinner'

function BlogDetailPage() {
  const { slug } = useParams()

  const { data: post, isLoading, error, refetch } = useQuery({
    queryKey: ['post', slug],
    queryFn: async () => {
      const response = await api.get(`/posts/${slug}/`)
      return response.data
    },
    retry: false,
  })

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
          Post not found
        </h2>
        <p className="text-gray-500 dark:text-gray-400">
          The blog post you're looking for doesn't exist or hasn't been published yet.
        </p>
      </div>
    )
  }

  return <BlogDetail post={post} refetch={refetch} />
}

export default BlogDetailPage