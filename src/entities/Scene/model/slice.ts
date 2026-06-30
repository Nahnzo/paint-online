import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { InitialSceneState, PathNode, SceneNode } from './types'
import { getNodeBounds } from 'features/ShapeFeatures'

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
    resizeNode(
      state,
      action: PayloadAction<{
        id: string
        dx: number
        dy: number
        handle: string
        angle: number
      }>,
    ) {
      const node = state.nodes.find((s) => s.id === action.payload.id)
      if (!node) return

      const { dx, dy, handle, angle } = action.payload

      if (handle === 'rotate') {
        if (node.type === 'path') {
          node.rotation = angle
        } else {
          node.rotation = angle
        }
        return
      }

      const rotation = node.rotation ?? 0

      const cos = Math.cos(-rotation)
      const sin = Math.sin(-rotation)
      const rotatedDx = dx * cos - dy * sin
      const rotatedDy = dx * sin + dy * cos

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
        let translateX = 0
        let translateY = 0

        switch (handle) {
          case 'bottomRight':
            newWidth = Math.max(1, currentWidth + rotatedDx)
            newHeight = Math.max(1, currentHeight + rotatedDy)
            break
          case 'topLeft':
            newWidth = Math.max(1, currentWidth - rotatedDx)
            newHeight = Math.max(1, currentHeight - rotatedDy)
            translateX = rotatedDx
            translateY = rotatedDy
            break
          case 'topRight':
            newWidth = Math.max(1, currentWidth + rotatedDx)
            newHeight = Math.max(1, currentHeight - rotatedDy)
            translateY = rotatedDy
            break
          case 'bottomLeft':
            newWidth = Math.max(1, currentWidth - rotatedDx)
            newHeight = Math.max(1, currentHeight + rotatedDy)
            translateX = rotatedDx
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

        if (translateX !== 0 || translateY !== 0) {
          transformedPoints = transformedPoints.map((p) => ({
            x: p.x + translateX,
            y: p.y + translateY,
          }))
        }

        node.points = transformedPoints
        return
      }

      const coordinates = node.coordinates ?? { x: 0, y: 0 }
      if ('width' in node && 'height' in node)
        switch (handle) {
          case 'bottomRight':
            node.width = Math.max(1, (node.width ?? 0) + rotatedDx)
            node.height = Math.max(1, (node.height ?? 0) + rotatedDy)
            break

          case 'topLeft':
            coordinates.x += rotatedDx
            coordinates.y += rotatedDy
            node.width = Math.max(1, (node.width ?? 0) - rotatedDx)
            node.height = Math.max(1, (node.height ?? 0) - rotatedDy)
            break

          case 'topRight':
            coordinates.x += rotatedDx
            coordinates.y += rotatedDy
            node.width = Math.max(1, (node.width ?? 0) + rotatedDx)
            node.height = Math.max(1, (node.height ?? 0) - rotatedDy)
            break

          case 'bottomLeft':
            coordinates.x += rotatedDx
            coordinates.y += rotatedDy
            node.width = Math.max(1, (node.width ?? 0) - rotatedDx)
            node.height = Math.max(1, (node.height ?? 0) + rotatedDy)
            break

          default:
            return
        }

      if (node.type === 'circle') {
        node.radius = Math.min(node.width ?? 0, node.height ?? 0) / 2
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
