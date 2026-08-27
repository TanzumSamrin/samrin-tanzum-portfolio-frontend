import { Link } from 'react-router-dom'
import Button from '../ui/Button'

function ContactCTA() {
  return (
    <section className="py-16 bg-primary text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">Let's Work Together</h2>
        <p className="text-lg mb-6 opacity-90 max-w-2xl mx-auto">
          Have a project in mind or want to collaborate? I'd love to hear from you!
        </p>
        <Link to="/contact">
          <Button variant="secondary" size="lg" className="bg-white text-primary hover:bg-gray-100">
            Get in Touch
          </Button>
        </Link>
      </div>
    </section>
  )
}

export default ContactCTA