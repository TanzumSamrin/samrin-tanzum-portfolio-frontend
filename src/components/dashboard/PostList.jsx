import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import api from '../../api/axios'
import Button from '../ui/Button'
import Spinner from '../ui/Spinner'
import { toast } from 'sonner'
import { FaEdit, FaTrash, FaPlus, FaEye, FaEyeSlash } from 'react-icons/fa'

function PostList() {
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState('')
  const [search, setSearch] = useState('')
  const queryClient = useQueryClient()

  const { data: posts, isLoading, error, refetch } = useQuery({
    queryKey: ['posts', { page, status: statusFilter, search }],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (page) params.append('page', page)
      if (statusFilter) params.append('status', statusFilter)
      if (search) params.append('search', search)
      params.append('page_size', 10)
      
      const response = await api.get(`/posts/?${params.toString()}`)
      return response.data
    },
  })

  const toggleStatusMutation = useMutation({
    mutationFn: async ({ slug, status }) => {
      await api.patch(`/posts/${slug}/`, { status })
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['posts'])
      toast.success('Post status updated')
      refetch()
    },
    onError: () => toast.error('Failed to update post'),
  })

  const deleteMutation = useMutation({
    mutationFn: async (slug) => {
      await api.delete(`/posts/${slug}/`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['posts'])
      toast.success('Post deleted')
      refetch()
    },
    onError: () => toast.error('Failed to delete post'),
  })

  const handleToggleStatus = (slug, currentStatus) => {
    const newStatus = currentStatus === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED'
    toggleStatusMutation.mutate({ slug, status: newStatus })
  }

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
        <p className="text-red-500 mb-4">Failed to load posts</p>
        <Button onClick={() => refetch()}>Retry</Button>
      </div>
    )
  }

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Posts</h2>
        <div className="flex gap-2">
          <Link to="/dashboard/posts/new">
            <Button variant="primary">
              <FaPlus className="mr-2" /> New Post
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="Search posts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-[200px] px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">All Status</option>
          <option value="PUBLISHED">Published</option>
          <option value="DRAFT">Draft</option>
        </select>
      </div>

      {posts?.results?.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400">No posts found</p>
        </div>
      ) : (
        <>
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {posts?.results?.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900 dark:text-white">{post.title}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{post.excerpt?.slice(0, 50)}...</div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleStatus(post.slug, post.status)}
                        className={`px-2 py-1 text-xs rounded-full ${
                          post.status === 'PUBLISHED'
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                            : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                        }`}
                      >
                        {post.status === 'PUBLISHED' ? (
                          <span className="flex items-center gap-1">
                            <FaEye size={12} /> Published
                          </span>
                        ) : (
                          <span className="flex items-center gap-1">
                            <FaEyeSlash size={12} /> Draft
                          </span>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600 dark:text-gray-300">{post.category?.name}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <Link
                          to={`/dashboard/posts/${post.slug}/edit`}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <FaEdit size={18} />
                        </Link>
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete "${post.title}"?`)) {
                              deleteMutation.mutate(post.slug)
                            }
                          }}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FaTrash size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {posts?.count > 10 && (
            <div className="flex justify-center gap-2 mt-6">
              {Array.from({ length: Math.ceil(posts.count / 10) }).map((_, i) => {
                const pageNum = i + 1
                return (
                  <button
                    key={i}
                    onClick={() => setPage(pageNum)}
                    className={`px-3 py-1 rounded transition-colors ${
                      page === pageNum
                        ? 'bg-primary text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    {pageNum}
                  </button>
                )
              })}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default PostList