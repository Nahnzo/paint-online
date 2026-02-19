import { ToolbarPosition } from '../model/types'
import styles from './toolbar.module.css'

interface ToolbarProps {
  position?: ToolbarPosition
  width?: number
  height?: number
  children: React.ReactNode
}

const Toolbar = ({ position = 'left', width, height, children }: ToolbarProps) => {
  const style = {
    width: width ? `${width}px` : undefined,
    height: height ? `${height}px` : undefined,
  }

  return (
    <div className={`${styles.toolbar} ${styles[position]}`} style={style}>
      {children}
    </div>
  )
}

export default Toolbar
