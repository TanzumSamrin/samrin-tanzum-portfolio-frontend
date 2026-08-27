import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../../api/axios'
import Button from '../ui/Button'
import Spinner from '../ui/Spinner'
import { toast } from 'sonner'
import { FaEnvelope, FaCheck, FaTrash, FaEnvelopeOpen } from 'react-icons/fa'

function MessageInbox() {
  const [page, setPage] = useState(1)
  const queryClient = useQueryClient()

  const { data: messages, isLoading, refetch } = useQuery({
    queryKey: ['messages', { page }],
    queryFn: async () => {
      const response = await api.get(`/contact/?page=${page}&page_size=10`)
      return response.data
    },
  })

  const markReadMutation = useMutation({
    mutationFn: async (id) => {
      await api.patch(`/contact/${id}/`, { is_read: true })
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['messages'])
      toast.success('Marked as read')
      refetch()
    },
    onError: () => toast.error('Failed to update message'),
  })

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await api.delete(`/contact/${id}/`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['messages'])
      toast.success('Message deleted')
      refetch()
    },
    onError: () => toast.error('Failed to delete message'),
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
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Messages</h2>

      {messages?.results?.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <FaEnvelope className="mx-auto text-gray-400 text-4xl mb-4" />
          <p className="text-gray-500 dark:text-gray-400">No messages yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages?.results?.map((message) => (
            <div
              key={message.id}
              className={`bg-white dark:bg-gray-800 p-6 rounded-lg border ${
                message.is_read
                  ? 'border-gray-200 dark:border-gray-700'
                  : 'border-primary/30 dark:border-primary/20 bg-primary/5 dark:bg-primary/5'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {message.subject}
                    </h3>
                    {!message.is_read && (
                      <span className="px-2 py-1 text-xs bg-primary text-white rounded-full">New</span>
                    )}
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">
                    From: <strong>{message.name}</strong> ({message.email})
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(message.created_at).toLocaleString()}
                  </p>
                  <p className="mt-3 text-gray-700 dark:text-gray-200 whitespace-pre-wrap">
                    {message.message}
                  </p>
                </div>
                <div className="flex gap-2 ml-4">
                  {!message.is_read && (
                    <button
                      onClick={() => markReadMutation.mutate(message.id)}
                      className="text-green-500 hover:text-green-700"
                      title="Mark as read"
                    >
                      <FaCheck size={18} />
                    </button>
                  )}
                  <button
                    onClick={() => {
                      if (window.confirm('Delete this message?')) {
                        deleteMutation.mutate(message.id)
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

      {messages?.count > 10 && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: Math.ceil(messages.count / 10) }).map((_, i) => {
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
    </div>
  )
}

export default MessageInbox