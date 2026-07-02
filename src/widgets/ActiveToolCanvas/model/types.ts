export enum ToolType {
  Brush = 'brush',
  Eraser = 'eraser',
  Spray = 'spray',
  Rectangle = 'rectangle',
  Circle = 'circle',
  Triangle = 'triangle',
  PaintRoller = 'paintRoller',
}

export type ToolMeta = {
  changeTypeComponent?: React.ReactNode
  settingsComponent: React.ReactNode
  activeToolIcon?: React.ReactElement
}
