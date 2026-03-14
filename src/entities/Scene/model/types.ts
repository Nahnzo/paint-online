import { ToolSettings, ToolType } from 'entities/Tool'

export interface ShapeBase {
  id: string
  type: Exclude<ToolType, 'fill-bucket' | 'eraser'>
  coordinates: { x: number; y: number }
  width?: number
  height?: number
  radius?: number
  rotation?: number
  settings: ToolSettings
}

export interface InitialSceneState {
  shapes: ShapeBase[]
  selectedShapeIds: string[]
  pastScene: ShapeBase[][]
  futureScene: ShapeBase[][]
}
