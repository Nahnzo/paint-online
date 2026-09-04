import { Point, ToolSettingsMap } from 'entities/Tool'

interface BaseSceneNode {
  id: string
  coordinates?: { x: number; y: number }
  rotation?: number
  backgroundColor?: string
  color?: string
}

interface RectangleNode extends BaseSceneNode {
  type: 'rectangle'
  width: number
  height: number
  settings?: ToolSettingsMap['rectangle']
}
interface SquareNode extends BaseSceneNode {
  type: 'square'
  width: number
  height: number
  settings?: ToolSettingsMap['square']
}

interface CircleNode extends BaseSceneNode {
  type: 'circle'
  radius: number
  settings?: ToolSettingsMap['circle']
}

export interface PathNode extends BaseSceneNode {
  type: 'path'
  points: Point[]
  isStart: boolean
  settings?: ToolSettingsMap['path']
}

interface TriangleNode extends BaseSceneNode {
  type: 'triangle'
  width: number
  height: number
  settings?: ToolSettingsMap['triangle']
}

export interface InitialSceneState {
  nodes: SceneNode[]
  selectedNodesIds: string[]
  pastScene: SceneNode[][]
  futureScene: SceneNode[][]
}

export type Bounds = {
  left: number
  top: number
  right: number
  bottom: number
}

export type SceneNode = RectangleNode | CircleNode | PathNode | TriangleNode | SquareNode

export type Handles = {
  topLeft: { x: number; y: number; cursor: string }
  topRight: { x: number; y: number; cursor: string }
  bottomRight: { x: number; y: number; cursor: string }
  bottomLeft: { x: number; y: number; cursor: string }
  rotate: { x: number; y: number; cursor: string }
}
