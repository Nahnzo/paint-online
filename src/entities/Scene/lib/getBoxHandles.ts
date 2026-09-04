import { Point } from 'entities/Tool'
import { Bounds, Handles, SceneNode } from '../model/types'
import { getGroupBounds, getNodeBounds } from './getNodeBounds'

const HANDLE_HIT_SIZE = 16

export const getResizeCursor = (baseCursor: string, rotation: number) => {
  const cursors = ['nwse-resize', 'ns-resize', 'nesw-resize', 'ew-resize']
  const degrees = ((rotation * 180) / Math.PI + 360) % 360
  const shift = Math.round(degrees / 45) % cursors.length
  const index = cursors.indexOf(baseCursor)
  return cursors[(index + shift) % cursors.length]
}

export const isPointOnHandle = (point: Point, handle: { x: number; y: number }) => {
  return (
    point.x >= handle.x - HANDLE_HIT_SIZE / 2 &&
    point.x <= handle.x + HANDLE_HIT_SIZE / 2 &&
    point.y >= handle.y - HANDLE_HIT_SIZE / 2 &&
    point.y <= handle.y + HANDLE_HIT_SIZE / 2
  )
}

export const getBoxHandles = (nodes: SceneNode[]): Handles | undefined => {
  if (nodes.length === 0) return undefined
  const bounds = nodes.length === 1 ? getNodeBounds(nodes[0]) : getGroupBounds(nodes)
  const rotation = nodes.length === 1 ? (nodes[0].rotation ?? 0) : 0

  return buildHandlesFromBounds(bounds, rotation)
}

const buildHandlesFromBounds = (bounds: Bounds, rotation: number): Handles => {
  const padding = 10

  const left = bounds.left - padding
  const top = bounds.top - padding
  const right = bounds.right + padding
  const bottom = bounds.bottom + padding

  const width = right - left
  const centerX = left + width / 2
  const centerY = top + (bottom - top) / 2

  const rotate = (px: number, py: number) => ({
    x: Math.cos(rotation) * (px - centerX) - Math.sin(rotation) * (py - centerY) + centerX,
    y: Math.sin(rotation) * (px - centerX) + Math.cos(rotation) * (py - centerY) + centerY,
  })

  return {
    topLeft: { ...rotate(left, top), cursor: getResizeCursor('nwse-resize', rotation) },
    topRight: { ...rotate(right, top), cursor: getResizeCursor('nesw-resize', rotation) },
    bottomRight: { ...rotate(right, bottom), cursor: getResizeCursor('nwse-resize', rotation) },
    bottomLeft: { ...rotate(left, bottom), cursor: getResizeCursor('nesw-resize', rotation) },
    rotate: { ...rotate(left + width / 2, top - 20), cursor: 'grab' },
  }
}
