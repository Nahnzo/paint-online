import { LucideIcon } from 'lucide-react'
import styles from './buttonIcon.module.css'

interface ButtonIconProps {
  icon: LucideIcon
  ariaLabel: string
  onClick: () => void
  isActive?: boolean
}

const ButtonIcon = ({ icon: Icon, ariaLabel, isActive, onClick }: ButtonIconProps) => {
  return (
    <button
      onClick={onClick}
      className={isActive ? styles.activeIconBtn : styles.iconBtn}
      aria-label={ariaLabel}
    >
      <Icon strokeWidth={1.5} size={20} />
    </button>
  )
}

export default ButtonIcon
