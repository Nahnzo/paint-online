import { useState } from 'react'

export const useDropdown = (): [boolean, () => void] => {
  const [isOpen, setIsOpen] = useState(false)
  const toggle = () => setIsOpen((curr) => !curr)
  return [isOpen, toggle]
}
