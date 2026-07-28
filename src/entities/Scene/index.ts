import { sceneReducer, sceneActions } from './model/slice'
import type { SceneNode } from './model/types'

import { getSelectedIdsSelector, getNodesSelector } from './model/selectors'

import {
  isPointInsideNodeBounds,
  getSelectionBounds,
  isBoundsInside,
  getNodeCenter,
  getAngle,
} from './lib/geometry'
import { isPointOnHandle } from './lib/getShapeHandles'
import { getShapeHandles } from './lib/getShapeHandles'
import { createNodeFrame, createMultiFrame } from './lib/drawSelectionFrame'
import { getNodeBounds, getGroupBounds } from './lib/getNodeBounds'
import { getNodeSettings } from './lib/getNodeSettings'

export {
  sceneReducer,
  getSelectedIdsSelector,
  getNodesSelector,
  isPointInsideNodeBounds,
  isPointOnHandle,
  getShapeHandles,
  createMultiFrame,
  createNodeFrame,
  getNodeBounds,
  getSelectionBounds,
  getGroupBounds,
  getAngle,
  isBoundsInside,
  getNodeSettings,
  getNodeCenter,
  sceneActions,
  SceneNode,
}
