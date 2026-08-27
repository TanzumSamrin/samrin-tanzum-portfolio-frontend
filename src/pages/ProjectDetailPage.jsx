import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import api from '../api/axios'
import Spinner from '../components/ui/Spinner'
import Button from '../components/ui/Button'
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa'

function ProjectDetailPage() {
  const { slug } = useParams()

  const { data: project, isLoading, error } = useQuery({
    queryKey: ['project', slug],
    queryFn: async () => {
      const response = await api.get(`/projects/${slug}/`)
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

  if (error || !project) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300">Project not found</h2>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      {project.cover_image && (
        <div className="aspect-video rounded-lg overflow-hidden mb-8">
          <img
            src={project.cover_image}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
        {project.title}
      </h1>
      
      <div className="flex flex-wrap gap-2 mb-4">
        <span className="px-3 py-1 text-sm bg-primary/10 text-primary rounded-full">
          {project.category}
        </span>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Completed: {new Date(project.completed_date).toLocaleDateString()}
        </span>
      </div>

      <div className="flex gap-4 mb-6">
        {project.live_url && (
          <a href={project.live_url} target="_blank" rel="noopener noreferrer">
            <Button variant="primary">
              <FaExternalLinkAlt className="mr-2" /> Live Demo
            </Button>
          </a>
        )}
        {project.github_url && (
          <a href={project.github_url} target="_blank" rel="noopener noreferrer">
            <Button variant="outline">
              <FaGithub className="mr-2" /> View Code
            </Button>
          </a>
        )}
      </div>

      <div className="prose prose-lg dark:prose-invert max-w-none">
        <p className="text-gray-600 dark:text-gray-300">{project.description}</p>
      </div>

      {project.tech_stack?.length > 0 && (
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-8">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Tech Stack
          </h3>
          <div className="flex flex-wrap gap-2">
            {project.tech_stack.map((tech) => (
              <span
                key={tech.id}
                className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-lg"
              >
                {tech.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ProjectDetailPage