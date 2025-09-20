import { useTheme } from '../../../hooks/useTheme'
import Button from '../Button'
import './ThemeSwitcher.scss'

interface ThemeSwitcherProps {
  variant?: 'icon' | 'dropdown'
  size?: 'small' | 'medium' | 'large'
  className?: string
}

const ThemeSwitcher = ({
  variant = 'icon',
  size = 'medium',
  className = ''
}: ThemeSwitcherProps) => {
  const { theme, actualTheme, setTheme, toggleTheme } = useTheme()

  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return '☀️'
      case 'dark':
        return '🌙'
      case 'auto':
        return actualTheme === 'dark' ? '🌙' : '☀️'
      default:
        return '🌙'
    }
  }

  const getThemeLabel = () => {
    switch (theme) {
      case 'light':
        return 'Light'
      case 'dark':
        return 'Dark'
      case 'auto':
        return `Auto (${actualTheme})`
      default:
        return 'Theme'
    }
  }

  if (variant === 'icon') {
    return (
      <Button
        variant="ghost"
        size={size}
        onClick={toggleTheme}
        className={`theme-switcher theme-switcher--icon ${className}`}
        aria-label={`Switch theme (current: ${getThemeLabel()})`}
        title={`Current theme: ${getThemeLabel()}. Click to cycle through themes.`}
      >
        <span className="theme-switcher__icon">
          {getThemeIcon()}
        </span>
      </Button>
    )
  }

  return (
    <div className={`theme-switcher theme-switcher--dropdown ${className}`}>
      <div className="theme-switcher__label">Theme</div>
      <div className="theme-switcher__options">
        <Button
          variant={theme === 'light' ? 'primary' : 'ghost'}
          size="small"
          onClick={() => setTheme('light')}
          className="theme-switcher__option"
        >
          ☀️ Light
        </Button>
        <Button
          variant={theme === 'dark' ? 'primary' : 'ghost'}
          size="small"
          onClick={() => setTheme('dark')}
          className="theme-switcher__option"
        >
          🌙 Dark
        </Button>
        <Button
          variant={theme === 'auto' ? 'primary' : 'ghost'}
          size="small"
          onClick={() => setTheme('auto')}
          className="theme-switcher__option"
        >
          🔄 Auto
        </Button>
      </div>
    </div>
  )
}

export default ThemeSwitcher