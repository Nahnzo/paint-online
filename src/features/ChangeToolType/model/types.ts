import { LucideIcon } from 'lucide-react'
import { ToolType } from 'entities/Tool'

export type ToolTypeOption = {
  type: ToolType
  icon: LucideIcon
  ariaLabel: string
}
