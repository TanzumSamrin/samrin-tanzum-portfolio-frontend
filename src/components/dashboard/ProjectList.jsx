import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import api from '../../api/axios'
import Button from '../ui/Button'
import Spinner from '../ui/Spinner'
import { toast } from 'sonner'
import { FaEdit, FaTrash, FaPlus, FaExternalLinkAlt, FaGithub } from 'react-icons/fa'

function ProjectList() {
  const [page, setPage] = useState(1)
  const queryClient = useQueryClient()

  const { data: projects, isLoading, error, refetch } = useQuery({
    queryKey: ['projects', { page }],
    queryFn: async () => {
      const response = await api.get(`/projects/?page=${page}&page_size=10`)
      return response.data
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (slug) => {
      await api.delete(`/projects/${slug}/`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['projects'])
      toast.success('Project deleted successfully!')
      refetch()
    },
    onError: () => {
      toast.error('Failed to delete project')
    },
  })

  const handleDelete = (slug, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      deleteMutation.mutate(slug)
    }
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
        <p className="text-red-500 mb-4">Failed to load projects</p>
        <Button onClick={() => refetch()}>Retry</Button>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Projects</h2>
        <Link to="/dashboard/projects/new">
          <Button variant="primary">
            <FaPlus className="mr-2" /> Add Project
          </Button>
        </Link>
      </div>

      {projects?.results?.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400">No projects yet. Create your first project!</p>
          <Link to="/dashboard/projects/new" className="mt-4 inline-block">
            <Button variant="primary">Create Project</Button>
          </Link>
        </div>
      ) : (
        <>
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Project
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Featured
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {projects?.results?.map((project) => (
                  <tr key={project.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {project.cover_image && (
                          <img
                            src={project.cover_image}
                            alt={project.title}
                            className="w-12 h-12 rounded object-cover mr-3"
                          />
                        )}
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {project.title}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {project.summary?.slice(0, 50)}...
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 text-xs bg-primary/10 text-primary rounded">
                        {project.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {project.is_featured ? (
                        <span className="text-green-500">★ Featured</span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <Link
                          to={`/dashboard/projects/${project.slug}/edit`}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <FaEdit size={18} />
                        </Link>
                        <button
                          onClick={() => handleDelete(project.slug, project.title)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FaTrash size={18} />
                        </button>
                        <a
                          href={project.live_url || project.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                        >
                          {project.live_url ? <FaExternalLinkAlt size={16} /> : <FaGithub size={16} />}
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {projects?.count > 10 && (
            <div className="flex justify-center gap-2 mt-6">
              {Array.from({ length: Math.ceil(projects.count / 10) }).map((_, i) => {
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

export default ProjectList