import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { InitialSceneState, PathNode, SceneNode } from './types'
import { getNodeBounds } from '../lib/getNodeBounds'

const initialState: InitialSceneState = {
  selectedNodesIds: [],
  nodes: [],
  pastScene: [],
  futureScene: [],
}
export const sceneSlice = createSlice({
  name: 'scene',
  initialState,
  reducers: {
    addNode(state, action: PayloadAction<SceneNode>) {
      state.pastScene = [...state.pastScene, [...state.nodes]]

      const node = action.payload

      if (node.type === 'path') {
        const existingIndex = state.nodes.findIndex((n) => n.id === node.id)

        if (existingIndex !== -1) {
          const existingPath = state.nodes[existingIndex] as PathNode
          const updatedPath: PathNode = {
            ...existingPath,
            points: [...(existingPath.points || []), ...(node.points || [])],
            isStart: node.isStart ?? existingPath.isStart,
          }
          state.nodes[existingIndex] = updatedPath
        } else {
          state.nodes.push(node)
        }
      } else {
        state.nodes.push(node)
      }
      state.futureScene = []
    },
    moveSelectedNodes(state, action: PayloadAction<{ ids: string[]; dx: number; dy: number }>) {
      const { dx, dy, ids } = action.payload
      state.nodes.forEach((node) => {
        if (!ids.includes(node.id)) return

        if (node.type === 'path') {
          node.points =
            node.points?.map((p) => ({
              x: p.x + dx,
              y: p.y + dy,
            })) ?? []
          return
        }

        if (node.coordinates) {
          node.coordinates.x += dx
          node.coordinates.y += dy
        }
      })
    },
    rotateNode(
      state,
      action: PayloadAction<{
        id: string
        angle: number
      }>,
    ) {
      const node = state.nodes.find((node) => node.id === action.payload.id)
      if (!node) return
      node.rotation = action.payload.angle
    },
    resizeNode(
      state,
      action: PayloadAction<{
        id: string
        dx: number
        dy: number
        handle: string
      }>,
    ) {
      const node = state.nodes.find((s) => s.id === action.payload.id)
      if (!node) return

      const { dx, dy, handle } = action.payload

      const rotation = node.rotation ?? 0
      const cos = Math.cos(-rotation)
      const sin = Math.sin(-rotation)
      const localDx = dx * cos - dy * sin
      const localDy = dx * sin + dy * cos

      if (node.type === 'path') {
        const points = node.points ?? []
        if (points.length === 0) return

        const bounds = getNodeBounds(node)
        const center = {
          x: (bounds.left + bounds.right) / 2,
          y: (bounds.top + bounds.bottom) / 2,
        }
        const currentWidth = bounds.right - bounds.left
        const currentHeight = bounds.bottom - bounds.top

        if (currentWidth === 0 || currentHeight === 0) return

        let newWidth = currentWidth
        let newHeight = currentHeight
        let localTranslateX = 0
        let localTranslateY = 0

        switch (handle) {
          case 'bottomRight':
            newWidth = Math.max(1, currentWidth + localDx)
            newHeight = Math.max(1, currentHeight + localDy)
            break
          case 'topLeft':
            newWidth = Math.max(1, currentWidth - localDx)
            newHeight = Math.max(1, currentHeight - localDy)
            localTranslateX = localDx
            localTranslateY = localDy
            break
          case 'topRight':
            newWidth = Math.max(1, currentWidth + localDx)
            newHeight = Math.max(1, currentHeight - localDy)
            localTranslateY = localDy
            break
          case 'bottomLeft':
            newWidth = Math.max(1, currentWidth - localDx)
            newHeight = Math.max(1, currentHeight + localDy)
            localTranslateX = localDx
            break
          default:
            return
        }

        const scaleX = newWidth / currentWidth
        const scaleY = newHeight / currentHeight

        let transformedPoints = points.map((p) => ({
          x: (p.x - center.x) * scaleX + center.x,
          y: (p.y - center.y) * scaleY + center.y,
        }))

        if (localTranslateX !== 0 || localTranslateY !== 0) {
          transformedPoints = transformedPoints.map((p) => ({
            x: p.x + localTranslateX,
            y: p.y + localTranslateY,
          }))
        }

        node.points = transformedPoints
        return
      }

      if ('width' in node && 'height' in node) {
        const currentWidth = node.width ?? 0
        const currentHeight = node.height ?? 0

        let newWidth = currentWidth
        let newHeight = currentHeight
        let localTranslateX = 0
        let localTranslateY = 0

        switch (handle) {
          case 'bottomRight':
            newWidth = Math.max(1, currentWidth + localDx)
            newHeight = Math.max(1, currentHeight + localDy)
            break
          case 'topLeft':
            newWidth = Math.max(1, currentWidth - localDx)
            newHeight = Math.max(1, currentHeight - localDy)
            localTranslateX = localDx
            localTranslateY = localDy
            break
          case 'topRight':
            newWidth = Math.max(1, currentWidth + localDx)
            newHeight = Math.max(1, currentHeight - localDy)
            localTranslateY = localDy
            break
          case 'bottomLeft':
            newWidth = Math.max(1, currentWidth - localDx)
            newHeight = Math.max(1, currentHeight + localDy)
            localTranslateX = localDx
            break
          default:
            return
        }

        node.width = newWidth
        node.height = newHeight

        if (localTranslateX !== 0 || localTranslateY !== 0) {
          const worldCos = Math.cos(rotation)
          const worldSin = Math.sin(rotation)
          const worldTranslateX = localTranslateX * worldCos - localTranslateY * worldSin
          const worldTranslateY = localTranslateX * worldSin + localTranslateY * worldCos

          if (node.coordinates) {
            node.coordinates.x += worldTranslateX
            node.coordinates.y += worldTranslateY
          }
        }
        return
      }

      if (node.type === 'circle') {
        const avgLocalDelta = (Math.abs(localDx) + Math.abs(localDy)) / 2
        let sign = 1
        if (handle === 'topLeft' || handle === 'topRight' || handle === 'bottomLeft') {
          sign = -1
        }

        const delta = sign * avgLocalDelta
        node.radius = Math.max(1, (node.radius ?? 0) + delta)
      }
    },
    undo(state) {
      if (!state.pastScene.length) return
      const previous = state.pastScene[state.pastScene.length - 1]
      state.futureScene = [...state.futureScene, [...state.nodes]]
      state.nodes = previous
      state.pastScene = state.pastScene.slice(0, state.pastScene.length - 1)
    },
    redo(state) {
      if (!state.futureScene.length) return
      const next = state.futureScene[state.futureScene.length - 1]

      state.pastScene = [...state.pastScene, [...state.nodes]]
      state.nodes = next
      state.futureScene = state.futureScene.slice(0, state.futureScene.length - 1)
    },
    commitMove(state, action) {
      state.pastScene = [...state.pastScene, action.payload]
    },
    selectNode(state, action: PayloadAction<string>) {
      state.selectedNodesIds = [action.payload]
    },
    selectMultiNode(state, action: PayloadAction<string[]>) {
      state.selectedNodesIds = [...action.payload]
    },
    clearSelection(state) {
      state.selectedNodesIds = []
    },
    clearNodes(state) {
      state.nodes = []
    },
  },
})

export const sceneActions = sceneSlice.actions
export const sceneReducer = sceneSlice.reducer
