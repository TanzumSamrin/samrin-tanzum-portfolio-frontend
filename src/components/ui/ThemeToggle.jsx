import { useTheme } from '../../context/ThemeContext'
import { HiMoon, HiSun } from 'react-icons/hi'

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-md text-[var(--text-muted)] hover:text-accent hover:bg-accent/10 transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {theme === 'dark' ? (
        <HiSun className="w-5 h-5" />
      ) : (
        <HiMoon className="w-5 h-5" />
      )}
    </button>
  )
}

export default ThemeToggle