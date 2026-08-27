import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../../api/axios'
import Button from '../ui/Button'
import Spinner from '../ui/Spinner'
import { toast } from 'sonner'

function CommentSection({ postSlug }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [website, setWebsite] = useState('')
  const [content, setContent] = useState('')
  const [parentId, setParentId] = useState(null)
  const [replyTo, setReplyTo] = useState(null)
  const queryClient = useQueryClient()

  const { data: comments, isLoading } = useQuery({
    queryKey: ['comments', postSlug],
    queryFn: async () => {
      const response = await api.get(`/posts/${postSlug}/comments/`)
      return response.data
    },
  })

  const commentMutation = useMutation({
    mutationFn: async (data) => {
      const response = await api.post(`/posts/${postSlug}/comments/`, data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['comments', postSlug])
      setName('')
      setEmail('')
      setWebsite('')
      setContent('')
      setParentId(null)
      setReplyTo(null)
      toast.success('Your comment is awaiting approval!')
    },
    onError: () => {
      toast.error('Failed to post comment. Please try again.')
    },
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name || !email || !content) {
      toast.error('Please fill in all required fields')
      return
    }
    commentMutation.mutate({
      name,
      email,
      website,
      content,
      parent: parentId,
    })
  }

  const handleReply = (commentId, commentName) => {
    setParentId(commentId)
    setReplyTo(commentName)
    document.getElementById('comment-form').scrollIntoView({ behavior: 'smooth' })
  }

  const cancelReply = () => {
    setParentId(null)
    setReplyTo(null)
  }

  if (isLoading) {
    return (
      <div className="mt-8 flex justify-center">
        <Spinner />
      </div>
    )
  }

  return (
    <div className="mt-12 border-t border-gray-200 dark:border-gray-700 pt-8">
      <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
        Comments ({comments?.length || 0})
      </h3>

      <form id="comment-form" onSubmit={handleSubmit} className="mb-8">
        {replyTo && (
          <div className="mb-4 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-300">
              Replying to <strong>{replyTo}</strong>
            </span>
            <button
              type="button"
              onClick={cancelReply}
              className="text-sm text-red-500 hover:text-red-600"
            >
              Cancel
            </button>
          </div>
        )}
        
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            placeholder="Your Name *"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            type="email"
            placeholder="Your Email *"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        
        <input
          type="url"
          placeholder="Website (optional)"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary mb-4"
        />
        
        <textarea
          placeholder="Your comment *"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          rows="4"
          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary mb-4"
        />
        
        <Button
          type="submit"
          variant="primary"
          loading={commentMutation.isPending}
        >
          Post Comment
        </Button>
      </form>

      <div className="space-y-6">
        {comments?.map((comment) => (
          <div key={comment.id} className="border-l-4 border-primary pl-4">
            <div className="flex items-center justify-between mb-2">
              <div>
                <strong className="text-gray-900 dark:text-white">
                  {comment.name}
                </strong>
                <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                  {new Date(comment.created_at).toLocaleDateString()}
                </span>
              </div>
              <button
                onClick={() => handleReply(comment.id, comment.name)}
                className="text-sm text-primary hover:underline"
              >
                Reply
              </button>
            </div>
            <p className="text-gray-600 dark:text-gray-300">{comment.content}</p>
            
            {comment.replies?.length > 0 && (
              <div className="ml-8 mt-4 space-y-4">
                {comment.replies.map((reply) => (
                  <div key={reply.id} className="border-l-2 border-gray-300 dark:border-gray-600 pl-4">
                    <div className="flex items-center justify-between mb-1">
                      <div>
                        <strong className="text-gray-900 dark:text-white">
                          {reply.name}
                        </strong>
                        <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                          {new Date(reply.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300">{reply.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default CommentSection