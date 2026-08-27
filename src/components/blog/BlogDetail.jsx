import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../../api/axios'
import Button from '../ui/Button'
import CommentSection from './CommentSection'
import RelatedPosts from './RelatedPosts'
import { FaHeart, FaRegHeart, FaShare, FaCopy } from 'react-icons/fa'
import { toast } from 'sonner'

function BlogDetail({ post, refetch }) {
  const [isLiked, setIsLiked] = useState(post.is_liked || false)
  const [likesCount, setLikesCount] = useState(post.likes_count || 0)
  const queryClient = useQueryClient()

  const likeMutation = useMutation({
    mutationFn: async () => {
      const response = await api.post(`/posts/${post.slug}/like/`)
      return response.data
    },
    onMutate: () => {
      setIsLiked(!isLiked)
      setLikesCount(isLiked ? likesCount - 1 : likesCount + 1)
    },
    onSuccess: (data) => {
      setIsLiked(data.liked)
      setLikesCount(data.likes_count)
      queryClient.invalidateQueries(['post', post.slug])
    },
    onError: () => {
      setIsLiked(isLiked)
      setLikesCount(likesCount)
      toast.error('Failed to like post')
    },
  })

  const handleLike = () => {
    likeMutation.mutate()
  }

  const handleShare = () => {
    const url = window.location.href
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.excerpt,
        url: url,
      })
    } else {
      navigator.clipboard.writeText(url)
      toast.success('Link copied to clipboard!')
    }
  }

  return (
    <article className="container mx-auto px-4 py-12 max-w-4xl">
      {post.cover_image && (
        <div className="aspect-video rounded-lg overflow-hidden mb-8">
          <img
            src={post.cover_image}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
        {post.title}
      </h1>
      
      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 dark:text-gray-400 mb-6">
        <span>{new Date(post.published_at).toLocaleDateString()}</span>
        <span>·</span>
        <span>{post.reading_time} min read</span>
        <span>·</span>
        <span>{post.views_count} views</span>
        {post.category && (
          <>
            <span>·</span>
            <Link
              to={`/blog?category=${post.category.slug}`}
              className="text-primary hover:underline"
            >
              {post.category.name}
            </Link>
          </>
        )}
      </div>

      {post.tags?.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {post.tags.map((tag) => (
            <Link
              key={tag.id}
              to={`/blog?tag=${tag.slug}`}
              className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              #{tag.name}
            </Link>
          ))}
        </div>
      )}

      <div
        className="prose prose-lg dark:prose-invert max-w-none mb-8"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      <div className="flex items-center gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={handleLike}
          disabled={likeMutation.isPending}
          className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          {isLiked ? (
            <FaHeart className="text-red-500" size={20} />
          ) : (
            <FaRegHeart size={20} />
          )}
          <span>{likesCount}</span>
        </button>
        
        <button
          onClick={handleShare}
          className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <FaShare size={20} />
          <span>Share</span>
        </button>
        
        <button
          onClick={() => {
            navigator.clipboard.writeText(window.location.href)
            toast.success('Link copied!')
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <FaCopy size={20} />
          <span>Copy Link</span>
        </button>
      </div>

      <CommentSection postSlug={post.slug} />

      {post.related_posts?.length > 0 && (
        <RelatedPosts posts={post.related_posts} />
      )}
    </article>
  )
}

export default BlogDetail