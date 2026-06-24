import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { InitialSceneState, PathNode, SceneNode } from './types'

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
      action: PayloadAction<{ id: string; dx: number; dy: number; handle: string; angle: number }>,
    ) {
      const node = state.nodes.find((s) => s.id === action.payload.id)

      if (!node) return

      const { dx, dy, handle, angle } = action.payload
      const coordinates = node.coordinates ?? { x: 0, y: 0 }

      switch (handle) {
        case 'bottomRight':
          node.width = (node.width ?? 0) + dx
          node.height = (node.height ?? 0) + dy
          break
        case 'topLeft':
          coordinates.x += dx
          coordinates.y += dy
          node.width = (node.width ?? 0) - dx
          node.height = (node.height ?? 0) - dy
          break
        case 'topRight':
          coordinates.y += dy
          node.width = (node.width ?? 0) + dx
          node.height = (node.height ?? 0) - dy
          break
        case 'bottomLeft':
          coordinates.x += dx
          node.width = (node.width ?? 0) - dx
          node.height = (node.height ?? 0) + dy
          break
        case 'rotate':
          node.rotation = angle
          break
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
