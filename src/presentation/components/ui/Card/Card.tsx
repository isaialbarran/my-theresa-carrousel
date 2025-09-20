import './Card.scss'

interface CardProps {
  children: React.ReactNode
  className?: string
}

const Card = ({ children, className = '' }: CardProps) => {
  return (
    <section className={`card ${className}`}>
      {children}
    </section>
  )
}

export default Card