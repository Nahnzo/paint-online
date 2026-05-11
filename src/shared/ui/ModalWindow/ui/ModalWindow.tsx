import { Portal } from 'shared/ui/Portal'
import { ModalWindowProps } from '../model/types'
import styles from './modalWindow.module.css'

const ModalWindow = ({ isOpen, children }: ModalWindowProps) => {
  if (!isOpen) return null

  return (
    <Portal>
      <div className={styles.modalWindow}>{children}</div>
    </Portal>
  )
}

export default ModalWindow
