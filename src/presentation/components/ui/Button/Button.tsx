import './Button.scss'

interface ButtonProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'small' | 'medium' | 'large'
  disabled?: boolean
  className?: string
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  title?: string
  'aria-label'?: string
}

const Button = ({
  children,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  className = '',
  onClick,
  type = 'button',
  title,
  'aria-label': ariaLabel
}: ButtonProps) => {
  return (
    <button
      className={`btn btn--${variant} btn--${size} ${className}`}
      disabled={disabled}
      onClick={onClick}
      type={type}
      title={title}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  )
}

export default Button