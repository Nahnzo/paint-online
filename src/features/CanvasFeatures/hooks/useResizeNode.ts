import { useRef } from 'react'
import { sceneActions } from 'entities/Scene'
import { useActionCreators } from 'shared/hooks/hooks'
import { useDragHandle } from './useDragHandle'
import { getNodeCenter, getAngle } from 'entities/Scene'

export const useResizeNode = (overlayRef: React.RefObject<HTMLCanvasElement>) => {
  const { commitMove, resizeNode, rotateNode } = useActionCreators(sceneActions)

  const initialAngleRef = useRef(0)
  const initialRotationRef = useRef(0)

  useDragHandle(overlayRef, {
    onDragStart: (handle, point, node) => {
      if (handle === 'rotate') {
        initialAngleRef.current = getAngle(point, getNodeCenter(node))
        initialRotationRef.current = node.rotation ?? 0
      }
    },
    onDrag: (handle, dx, dy, point, node) => {
      if (handle === 'rotate') {
        const angle =
          getAngle(point, getNodeCenter(node)) -
          initialAngleRef.current +
          initialRotationRef.current
        rotateNode({ id: node.id, angle })
        return
      }
      resizeNode({ id: node.id, dx, dy, handle })
    },
    onDragEnd: (snapshot) => {
      commitMove(snapshot)
    },
  })
}
