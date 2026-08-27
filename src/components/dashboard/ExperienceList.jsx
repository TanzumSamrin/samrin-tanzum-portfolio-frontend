import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../../api/axios'
import Button from '../ui/Button'
import Spinner from '../ui/Spinner'
import { toast } from 'sonner'
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa'

function ExperienceList() {
  const queryClient = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    company: '',
    role: '',
    employment_type: 'FULL_TIME',
    location: '',
    start_date: '',
    end_date: '',
    is_current: false,
    description: '',
    company_url: '',
    display_order: 0,
  })

  const { data: experiences, isLoading, refetch } = useQuery({
    queryKey: ['experiences'],
    queryFn: async () => {
      const response = await api.get('/experiences/')
      return response.data
    },
  })

  const createMutation = useMutation({
    mutationFn: async (data) => {
      await api.post('/experiences/', data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['experiences'])
      toast.success('Experience added!')
      setShowForm(false)
      setFormData({
        company: '',
        role: '',
        employment_type: 'FULL_TIME',
        location: '',
        start_date: '',
        end_date: '',
        is_current: false,
        description: '',
        company_url: '',
        display_order: 0,
      })
      refetch()
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to add experience')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await api.delete(`/experiences/${id}/`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['experiences'])
      toast.success('Experience deleted!')
      refetch()
    },
    onError: () => toast.error('Failed to delete experience'),
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    createMutation.mutate(formData)
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

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
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Experience</h2>
        <Button onClick={() => setShowForm(!showForm)} variant="primary">
          <FaPlus className="mr-2" /> Add Experience
        </Button>
      </div>

      {/* Create Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 mb-6">
          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="text"
              name="company"
              placeholder="Company *"
              value={formData.company}
              onChange={handleChange}
              required
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              type="text"
              name="role"
              placeholder="Role *"
              value={formData.role}
              onChange={handleChange}
              required
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <select
              name="employment_type"
              value={formData.employment_type}
              onChange={handleChange}
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="FULL_TIME">Full Time</option>
              <option value="PART_TIME">Part Time</option>
              <option value="INTERNSHIP">Internship</option>
              <option value="FREELANCE">Freelance</option>
              <option value="CONTRACT">Contract</option>
            </select>
            <input
              type="text"
              name="location"
              placeholder="Location"
              value={formData.location}
              onChange={handleChange}
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              type="date"
              name="start_date"
              value={formData.start_date}
              onChange={handleChange}
              required
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {!formData.is_current && (
              <input
                type="date"
                name="end_date"
                value={formData.end_date}
                onChange={handleChange}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
              />
            )}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="is_current"
                checked={formData.is_current}
                onChange={handleChange}
                className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label className="text-sm text-gray-700 dark:text-gray-300">Current Position</label>
            </div>
            <input
              type="url"
              name="company_url"
              placeholder="Company URL"
              value={formData.company_url}
              onChange={handleChange}
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              type="number"
              name="display_order"
              placeholder="Display Order"
              value={formData.display_order}
              onChange={handleChange}
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <textarea
            name="description"
            placeholder="Description *"
            value={formData.description}
            onChange={handleChange}
            required
            rows="3"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary mt-4"
          />
          <div className="flex gap-4 mt-4">
            <Button type="submit" variant="primary" loading={createMutation.isPending}>
              Add Experience
            </Button>
            <Button type="button" variant="secondary" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
          </div>
        </form>
      )}

      {/* Experience List */}
      <div className="space-y-4">
        {experiences?.map((exp) => (
          <div key={exp.id} className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{exp.role}</h3>
                <p className="text-gray-600 dark:text-gray-300">{exp.company} · {exp.employment_type}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(exp.start_date).toLocaleDateString()} - {exp.is_current ? 'Present' : new Date(exp.end_date).toLocaleDateString()}
                </p>
                {exp.location && <p className="text-sm text-gray-500">{exp.location}</p>}
                <p className="text-gray-600 dark:text-gray-300 mt-2">{exp.description}</p>
              </div>
              <div className="flex gap-2">
                <button className="text-blue-500 hover:text-blue-700">
                  <FaEdit size={18} />
                </button>
                <button
                  onClick={() => {
                    if (window.confirm(`Delete "${exp.role}" at ${exp.company}?`)) {
                      deleteMutation.mutate(exp.id)
                    }
                  }}
                  className="text-red-500 hover:text-red-700"
                >
                  <FaTrash size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ExperienceList