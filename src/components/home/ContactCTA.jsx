import { Link } from 'react-router-dom'
import Button from '../ui/Button'

function ContactCTA() {
  return (
    <section className="section border-t border-[var(--border)]">
      <div className="container-page text-center">
        <p className="font-mono text-sm text-accent mb-3">
          <span className="text-[var(--text-muted)]">//</span> contact
        </p>
        <h2 className="text-2xl sm:text-3xl font-mono font-semibold text-[var(--text)] mb-4">
          Let&apos;s work together
        </h2>
        <p className="text-[var(--text-muted)] max-w-xl mx-auto mb-8">
          Have a project in mind or want to collaborate? I&apos;d love to hear from you.
        </p>
        <Link to="/contact">
          <Button variant="primary" size="md">
            Get in Touch
          </Button>
        </Link>
      </div>
    </section>
  )
}

export default ContactCTA