import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import api from '../api/axios'
import { useDebounce } from '../hooks/useDebounce'
import Button from '../components/ui/Button'
import Skeleton from '../components/ui/Skeleton'

function ProjectsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [category, setCategory] = useState(searchParams.get('category') || '')
  const [sort, setSort] = useState(searchParams.get('ordering') || '-completed_date')
  const [page, setPage] = useState(parseInt(searchParams.get('page')) || 1)
  
  const debouncedSearch = useDebounce(search, 400)

  useEffect(() => {
    const params = {}
    if (debouncedSearch) params.search = debouncedSearch
    if (category) params.category = category
    if (sort) params.ordering = sort
    if (page > 1) params.page = page
    setSearchParams(params)
  }, [debouncedSearch, category, sort, page, setSearchParams])

  const { data: projects, isLoading, error, refetch } = useQuery({
    queryKey: ['projects', { search: debouncedSearch, category, sort, page }],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (debouncedSearch) params.append('search', debouncedSearch)
      if (category) params.append('category', category)
      if (sort) params.append('ordering', sort)
      params.append('page', page)
      params.append('page_size', 9)
      
      const response = await api.get(`/projects/?${params.toString()}`)
      return response.data
    },
  })

  const categoryOptions = ['WEB', 'MOBILE', 'API', 'ML', 'OTHER']

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Skeleton className="h-10 w-48 mx-auto mb-8" />
        <div className="grid md:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-64 w-full" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-red-500 mb-4">Failed to load projects</p>
        <Button onClick={() => refetch()}>Retry</Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-8">
        Projects
      </h1>

      <div className="flex flex-wrap gap-4 mb-8">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search projects..."
          className="flex-1 min-w-[200px] px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
        />
        
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">All Categories</option>
          {categoryOptions.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="-completed_date">Newest</option>
          <option value="display_order">Display Order</option>
        </select>
      </div>

      {projects?.results?.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">No projects found</p>
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects?.results?.map((project) => (
              <a
                key={project.id}
                href={project.live_url || project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700"
              >
                {project.cover_image && (
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={project.cover_image}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    {project.summary}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {project.tech_stack?.slice(0, 3).map((tech) => (
                      <span
                        key={tech.id}
                        className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded"
                      >
                        {tech.name}
                      </span>
                    ))}
                  </div>
                </div>
              </a>
            ))}
          </div>

          {projects?.count > 9 && (
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: Math.ceil(projects.count / 9) }).map((_, i) => {
                const pageNum = i + 1
                return (
                  <button
                    key={i}
                    onClick={() => setPage(pageNum)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
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

export default ProjectsPage