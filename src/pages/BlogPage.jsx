import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import api from '../api/axios'
import { useDebounce } from '../hooks/useDebounce'
import BlogList from '../components/blog/BlogList'

function BlogPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [category, setCategory] = useState(searchParams.get('category') || '')
  const [tag, setTag] = useState(searchParams.get('tag') || '')
  const [sort, setSort] = useState(searchParams.get('ordering') || '-published_at')
  const [page, setPage] = useState(parseInt(searchParams.get('page')) || 1)
  
  const debouncedSearch = useDebounce(search, 400)

  useEffect(() => {
    const params = {}
    if (debouncedSearch) params.search = debouncedSearch
    if (category) params.category = category
    if (tag) params.tag = tag
    if (sort) params.ordering = sort
    if (page > 1) params.page = page
    setSearchParams(params)
  }, [debouncedSearch, category, tag, sort, page, setSearchParams])

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await api.get('/categories/')
      return response.data
    },
  })

  const { data: tags } = useQuery({
    queryKey: ['tags'],
    queryFn: async () => {
      const response = await api.get('/tags/')
      return response.data
    },
  })

  const { data: posts, isLoading, error, refetch } = useQuery({
    queryKey: ['posts', { search: debouncedSearch, category, tag, sort, page }],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (debouncedSearch) params.append('search', debouncedSearch)
      if (category) params.append('category', category)
      if (tag) params.append('tag', tag)
      if (sort) params.append('ordering', sort)
      params.append('page', page)
      params.append('page_size', 6)
      
      const response = await api.get(`/posts/?${params.toString()}`)
      return response.data
    },
  })

  return (
    <BlogList
      posts={posts}
      isLoading={isLoading}
      error={error}
      refetch={refetch}
      search={search}
      setSearch={setSearch}
      category={category}
      setCategory={setCategory}
      tag={tag}
      setTag={setTag}
      sort={sort}
      setSort={setSort}
      page={page}
      setPage={setPage}
      categories={categories}
      tags={tags}
    />
  )
}

export default BlogPage