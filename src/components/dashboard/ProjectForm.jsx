import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../../api/axios'
import Button from '../ui/Button'
import Spinner from '../ui/Spinner'
import { toast } from 'sonner'

function ProjectForm() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const isEditing = Boolean(slug)

  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    description: '',
    category: 'WEB',
    live_url: '',
    github_url: '',
    is_featured: false,
    completed_date: '',
    display_order: 0,
    tech_stack: [],
  })
  const [coverImage, setCoverImage] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)

  // Fetch project data if editing
  const { data: project, isLoading: isLoadingProject } = useQuery({
    queryKey: ['project', slug],
    queryFn: async () => {
      const response = await api.get(`/projects/${slug}/`)
      return response.data
    },
    enabled: isEditing,
  })

  // Fetch skills for tech stack
  const { data: skills } = useQuery({
    queryKey: ['skills'],
    queryFn: async () => {
      const response = await api.get('/skills/')
      return response.data
    },
  })

  useEffect(() => {
    if (project && isEditing) {
      setFormData({
        title: project.title || '',
        summary: project.summary || '',
        description: project.description || '',
        category: project.category || 'WEB',
        live_url: project.live_url || '',
        github_url: project.github_url || '',
        is_featured: project.is_featured || false,
        completed_date: project.completed_date || '',
        display_order: project.display_order || 0,
        tech_stack: project.tech_stack?.map(t => t.id) || [],
      })
      if (project.cover_image) {
        setPreviewUrl(project.cover_image)
      }
    }
  }, [project, isEditing])

  const mutation = useMutation({
    mutationFn: async (data) => {
      const formDataObj = new FormData()
      Object.keys(data).forEach(key => {
        if (key === 'tech_stack') {
          data[key].forEach(id => formDataObj.append('tech_stack', id))
        } else if (data[key] !== null && data[key] !== undefined) {
          formDataObj.append(key, data[key])
        }
      })
      if (coverImage) {
        formDataObj.append('cover_image', coverImage)
      }

      const url = isEditing ? `/projects/${slug}/` : '/projects/'
      const method = isEditing ? 'patch' : 'post'
      const response = await api[method](url, formDataObj, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['projects'])
      toast.success(isEditing ? 'Project updated!' : 'Project created!')
      navigate('/dashboard/projects')
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to save project')
    },
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    mutation.mutate(formData)
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleTechToggle = (skillId) => {
    setFormData(prev => ({
      ...prev,
      tech_stack: prev.tech_stack.includes(skillId)
        ? prev.tech_stack.filter(id => id !== skillId)
        : [...prev.tech_stack, skillId],
    }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setCoverImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  if (isLoadingProject && isEditing) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        {isEditing ? 'Edit Project' : 'Create New Project'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Summary */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Summary (max 200 chars) *
          </label>
          <input
            type="text"
            name="summary"
            value={formData.summary}
            onChange={handleChange}
            required
            maxLength={200}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <p className="text-sm text-gray-500 mt-1">{formData.summary.length}/200</p>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Description *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows="6"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Category *
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="WEB">Web</option>
            <option value="MOBILE">Mobile</option>
            <option value="API">API</option>
            <option value="ML">Machine Learning</option>
            <option value="OTHER">Other</option>
          </select>
        </div>

        {/* URLs */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Live URL
            </label>
            <input
              type="url"
              name="live_url"
              value={formData.live_url}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              GitHub URL
            </label>
            <input
              type="url"
              name="github_url"
              value={formData.github_url}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* Cover Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Cover Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {previewUrl && (
            <div className="mt-2">
              <img src={previewUrl} alt="Preview" className="w-48 h-32 object-cover rounded-lg" />
            </div>
          )}
        </div>

        {/* Tech Stack */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Tech Stack
          </label>
          <div className="flex flex-wrap gap-2">
            {skills?.map((skill) => (
              <button
                key={skill.id}
                type="button"
                onClick={() => handleTechToggle(skill.id)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  formData.tech_stack.includes(skill.id)
                    ? 'bg-primary text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {skill.name}
              </button>
            ))}
          </div>
        </div>

        {/* Featured & Date */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Completed Date *
            </label>
            <input
              type="date"
              name="completed_date"
              value={formData.completed_date}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Display Order
            </label>
            <input
              type="number"
              name="display_order"
              value={formData.display_order}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* Featured Checkbox */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            <input
              type="checkbox"
              name="is_featured"
              checked={formData.is_featured}
              onChange={handleChange}
              className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            Featured Project
          </label>
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button type="submit" variant="primary" loading={mutation.isPending}>
            {isEditing ? 'Update Project' : 'Create Project'}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate('/dashboard/projects')}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}

export default ProjectForm