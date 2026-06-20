import { Point, ToolSettings } from 'entities/Tool'

interface BaseSceneNode {
  id: string
  coordinates?: { x: number; y: number }
  rotation?: number
  settings?: ToolSettings
}

interface RectangleNode extends BaseSceneNode {
  type: 'rectangle'
  width: number
  height: number
}

interface CircleNode extends BaseSceneNode {
  type: 'circle'
  radius: number
}

export interface PathNode extends BaseSceneNode {
  type: 'path'
  points: Point[]
  isStart: boolean
}

interface TriangleNode extends BaseSceneNode {
  type: 'triangle'
  width: number
  height: number
}

export interface InitialSceneState {
  nodes: SceneNode[]
  selectedNodesIds: string[]
  pastScene: SceneNode[][]
  futureScene: SceneNode[][]
}

export type SceneNode = RectangleNode | CircleNode | PathNode | TriangleNode
