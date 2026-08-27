import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../../api/axios'
import Button from '../ui/Button'
import Spinner from '../ui/Spinner'
import { toast } from 'sonner'
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa'

function SkillList() {
  const [editingSkill, setEditingSkill] = useState(null)
  const [formData, setFormData] = useState({ name: '', category: 'FRONTEND', proficiency: 50 })
  const queryClient = useQueryClient()

  const { data: skills, isLoading, refetch } = useQuery({
    queryKey: ['skills'],
    queryFn: async () => {
      const response = await api.get('/skills/')
      return response.data
    },
  })

  const createMutation = useMutation({
    mutationFn: async (data) => {
      await api.post('/skills/', data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['skills'])
      toast.success('Skill created!')
      setFormData({ name: '', category: 'FRONTEND', proficiency: 50 })
      refetch()
    },
    onError: () => toast.error('Failed to create skill'),
  })

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await api.delete(`/skills/${id}/`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['skills'])
      toast.success('Skill deleted!')
      refetch()
    },
    onError: () => toast.error('Failed to delete skill'),
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.name.trim()) {
      toast.error('Skill name is required')
      return
    }
    createMutation.mutate(formData)
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
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Skills</h2>

      {/* Create Form */}
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 mb-6">
        <div className="grid md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Skill name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="FRONTEND">Frontend</option>
            <option value="BACKEND">Backend</option>
            <option value="DATABASE">Database</option>
            <option value="DEVOPS">DevOps</option>
            <option value="TOOLS">Tools</option>
            <option value="SOFT_SKILL">Soft Skill</option>
          </select>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Proficiency (1-100)"
              value={formData.proficiency}
              onChange={(e) => setFormData({ ...formData, proficiency: parseInt(e.target.value) || 0 })}
              className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Button type="submit" variant="primary" loading={createMutation.isPending}>
              <FaPlus />
            </Button>
          </div>
        </div>
      </form>

      {/* Skills List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Proficiency</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {skills?.map((skill) => (
              <tr key={skill.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{skill.name}</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 text-xs bg-primary/10 text-primary rounded">{skill.category}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: `${skill.proficiency}%` }} />
                    </div>
                    <span className="text-sm text-gray-500">{skill.proficiency}%</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button className="text-blue-500 hover:text-blue-700">
                      <FaEdit size={18} />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`Delete "${skill.name}"?`)) {
                          deleteMutation.mutate(skill.id)
                        }
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FaTrash size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default SkillList