import { Point } from 'entities/Tool'
import { SceneNode } from '../model/types'
import { getNodeBounds } from './getNodeBounds'

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

export const getShapeHandles = (node: SceneNode) => {
  const bounds = getNodeBounds(node)
  const padding = 10

  const left = bounds.left - padding
  const top = bounds.top - padding
  const right = bounds.right + padding
  const bottom = bounds.bottom + padding

  const width = right - left
  const height = bottom - top
  const centerX = left + width / 2
  const centerY = top + height / 2
  const rotation = node.rotation ?? 0

  const rotate = (px: number, py: number) => ({
    x: Math.cos(rotation) * (px - centerX) - Math.sin(rotation) * (py - centerY) + centerX,
    y: Math.sin(rotation) * (px - centerX) + Math.cos(rotation) * (py - centerY) + centerY,
  })

  const tl = rotate(left, top)
  const tr = rotate(right, top)
  const br = rotate(right, bottom)
  const bl = rotate(left, bottom)

  const rot = rotate(left + width / 2, top - 20)

  return {
    topLeft: { ...tl, cursor: getResizeCursor('nwse-resize', rotation) },
    topRight: { ...tr, cursor: getResizeCursor('nesw-resize', rotation) },
    bottomRight: { ...br, cursor: getResizeCursor('nwse-resize', rotation) },
    bottomLeft: { ...bl, cursor: getResizeCursor('nesw-resize', rotation) },
    rotate: { ...rot, cursor: 'grab' },
  }
}
