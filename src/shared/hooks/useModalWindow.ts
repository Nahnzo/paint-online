import { useEffect, useState } from 'react'

export const useModalWindow = (): [boolean, () => void] => {
  const [isOpen, setIsOpen] = useState(false)

  const handleModalWindow = () => setIsOpen((curr) => !curr)

  useEffect(() => {
    if (!isOpen) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [isOpen])

  return [isOpen, handleModalWindow]
}
