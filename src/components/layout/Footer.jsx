import { Link } from 'react-router-dom'
import { FaGithub, FaLinkedin, FaTwitter, FaEnvelope } from 'react-icons/fa'

function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-[var(--border)] bg-[var(--surface)]">
      <div className="container-page py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <p className="font-mono text-lg text-[var(--text)] mb-3">
              <span className="text-accent">~/</span>samrin
            </p>
            <p className="text-sm text-[var(--text-muted)] leading-relaxed">
              Full-Stack Developer. Building clean, functional web applications with React & Django.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-mono text-sm text-accent mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-[var(--text-muted)] hover:text-accent transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/projects" className="text-[var(--text-muted)] hover:text-accent transition-colors">
                  Projects
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-[var(--text-muted)] hover:text-accent transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-[var(--text-muted)] hover:text-accent transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-mono text-sm text-accent mb-4">Connect</h4>
            <div className="flex gap-4">
              <a
                href="https://github.com/yourusername"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--text-muted)] hover:text-accent transition-colors"
                aria-label="GitHub"
              >
                <FaGithub size={20} />
              </a>
              <a
                href="https://linkedin.com/in/yourusername"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--text-muted)] hover:text-accent transition-colors"
                aria-label="LinkedIn"
              >
                <FaLinkedin size={20} />
              </a>
              <a
                href="https://twitter.com/yourusername"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--text-muted)] hover:text-accent transition-colors"
                aria-label="Twitter"
              >
                <FaTwitter size={20} />
              </a>
              <a
                href="mailto:samrin@email.com"
                className="text-[var(--text-muted)] hover:text-accent transition-colors"
                aria-label="Email"
              >
                <FaEnvelope size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-[var(--border)] text-center">
          <p className="text-sm font-mono text-[var(--text-muted)]">
            © {currentYear} Samrin Tanzum. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer