import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../../api/axios'
import Button from '../ui/Button'
import Spinner from '../ui/Spinner'
import { toast } from 'sonner'
import { FaCheck, FaTimes, FaTrash } from 'react-icons/fa'

function CommentModeration() {
  const [filter, setFilter] = useState('false')
  const queryClient = useQueryClient()

  const { data: comments, isLoading, refetch } = useQuery({
    queryKey: ['comments', { is_approved: filter }],
    queryFn: async () => {
      const response = await api.get(`/comments/?is_approved=${filter}`)
      return response.data
    },
  })

  const approveMutation = useMutation({
    mutationFn: async ({ id, is_approved }) => {
      await api.patch(`/comments/${id}/`, { is_approved })
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['comments'])
      toast.success('Comment updated')
      refetch()
    },
    onError: () => toast.error('Failed to update comment'),
  })

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await api.delete(`/comments/${id}/`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['comments'])
      toast.success('Comment deleted')
      refetch()
    },
    onError: () => toast.error('Failed to delete comment'),
  })

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Comment Moderation</h2>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="false">Pending Approval</option>
          <option value="true">Approved</option>
          <option value="">All Comments</option>
        </select>
      </div>

      {comments?.results?.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400">No comments found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments?.results?.map((comment) => (
            <div
              key={comment.id}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {comment.name}
                    </h3>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      on "{comment.post?.title}"
                    </span>
                    <span className={`px-2 py-1 text-xs rounded ${
                      comment.is_approved
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                        : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                    }`}>
                      {comment.is_approved ? 'Approved' : 'Pending'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(comment.created_at).toLocaleString()}
                  </p>
                  <p className="mt-2 text-gray-700 dark:text-gray-200">
                    {comment.content}
                  </p>
                </div>
                <div className="flex gap-2 ml-4">
                  {!comment.is_approved && (
                    <button
                      onClick={() => approveMutation.mutate({ id: comment.id, is_approved: true })}
                      className="text-green-500 hover:text-green-700"
                      title="Approve"
                    >
                      <FaCheck size={18} />
                    </button>
                  )}
                  {comment.is_approved && (
                    <button
                      onClick={() => approveMutation.mutate({ id: comment.id, is_approved: false })}
                      className="text-yellow-500 hover:text-yellow-700"
                      title="Unapprove"
                    >
                      <FaTimes size={18} />
                    </button>
                  )}
                  <button
                    onClick={() => {
                      if (window.confirm('Delete this comment?')) {
                        deleteMutation.mutate(comment.id)
                      }
                    }}
                    className="text-red-500 hover:text-red-700"
                    title="Delete"
                  >
                    <FaTrash size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default CommentModeration