import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import api from '../api/axios'
import Button from '../components/ui/Button'
import { toast } from 'sonner'

function ContactPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')

  const contactMutation = useMutation({
    mutationFn: async (data) => {
      const response = await api.post('/contact/', data)
      return response.data
    },
    onSuccess: () => {
      toast.success('Message sent successfully! I\'ll get back to you soon.')
      setName('')
      setEmail('')
      setSubject('')
      setMessage('')
    },
    onError: (error) => {
      if (error.response?.status === 429) {
        toast.error('Too many attempts. Please try again later.')
      } else {
        toast.error('Failed to send message. Please try again.')
      }
    },
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name || !email || !subject || !message) {
      toast.error('Please fill in all fields')
      return
    }
    contactMutation.mutate({ name, email, subject, message })
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <h1 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-4">
        Get in Touch
      </h1>
      <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
        Have a question or want to work together? Let's talk!
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Your Name *
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Your Email *
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Subject *
          </label>
          <input
            type="text"
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Message *
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            rows="6"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={contactMutation.isPending}
          className="w-full"
        >
          Send Message
        </Button>
      </form>
    </div>
  )
}

export default ContactPage