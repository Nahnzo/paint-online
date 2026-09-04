import { sceneReducer, sceneActions } from './model/slice'
import type { SceneNode } from './model/types'

import { getSelectedIdsSelector, getNodesSelector } from './model/selectors'

import {
  isPointInsideNodeBounds,
  getSelectionBounds,
  isBoundsInside,
  getNodeCenter,
  getAngle,
  getGroupCenter,
} from './lib/geometry'
import { isPointOnHandle, getBoxHandles } from './lib/getBoxHandles'
import { createNodeFrame, createMultiFrame } from './lib/drawSelectionFrame'
import { getNodeBounds, getGroupBounds } from './lib/getNodeBounds'
import { getNodeSettings } from './lib/getNodeSettings'

export {
  sceneReducer,
  getSelectedIdsSelector,
  getNodesSelector,
  isPointInsideNodeBounds,
  isPointOnHandle,
  createMultiFrame,
  createNodeFrame,
  getNodeBounds,
  getSelectionBounds,
  getGroupBounds,
  getAngle,
  isBoundsInside,
  getNodeSettings,
  getNodeCenter,
  getGroupCenter,
  getBoxHandles,
  sceneActions,
  SceneNode,
}
