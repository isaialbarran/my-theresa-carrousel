import './Card.scss'

interface CardProps {
  children: React.ReactNode
  variant?: 'default' | 'elevated' | 'outlined' | 'flat'
  padding?: 'none' | 'small' | 'medium' | 'large'
  className?: string
  style?: React.CSSProperties
  onClick?: () => void
  hoverable?: boolean
}

const Card = ({
  children,
  variant = 'default',
  padding = 'medium',
  className = '',
  style,
  onClick,
  hoverable = false
}: CardProps) => {
  const isClickable = onClick || hoverable

  return (
    <section
      className={`card card--${variant} card--padding-${padding} ${
        isClickable ? 'card--clickable' : ''
      } ${className}`}
      style={style}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </section>
  )
}

export default Card