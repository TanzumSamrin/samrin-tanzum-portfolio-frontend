import { Outlet, NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
  FaHome,
  FaFileAlt,
  FaProjectDiagram,
  FaCode,
  FaBriefcase,
  FaComments,
  FaEnvelope,
  FaUserCog,
  FaSignOutAlt,
} from 'react-icons/fa'

function DashboardLayout() {
  const { logout } = useAuth()

  const navItems = [
    { to: '/dashboard', icon: FaHome, label: 'Overview' },
    { to: '/dashboard/posts', icon: FaFileAlt, label: 'Posts' },
    { to: '/dashboard/projects', icon: FaProjectDiagram, label: 'Projects' },
    { to: '/dashboard/skills', icon: FaCode, label: 'Skills' },
    { to: '/dashboard/experience', icon: FaBriefcase, label: 'Experience' },
    { to: '/dashboard/comments', icon: FaComments, label: 'Comments' },
    { to: '/dashboard/messages', icon: FaEnvelope, label: 'Messages' },
    { to: '/dashboard/profile', icon: FaUserCog, label: 'Profile' },
  ]

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 fixed h-full overflow-y-auto">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Dashboard</h2>
        </div>
        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/dashboard'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`
              }
            >
              <item.icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          ))}
          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-2 w-full text-left rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <FaSignOutAlt size={18} />
            <span>Logout</span>
          </button>
        </nav>
      </aside>

      <main className="ml-64 flex-1 p-6">
        <Outlet />
      </main>
    </div>
  )
}

export default DashboardLayout