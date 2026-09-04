import { useRef } from 'react'
import { getGroupCenter, sceneActions } from 'entities/Scene'
import { useActionCreators } from 'shared/hooks/hooks'
import { useDragHandle } from './useDragHandle'
import { getNodeCenter, getAngle } from 'entities/Scene'

export const useResizeNode = (overlayRef: React.RefObject<HTMLCanvasElement>) => {
  const { commitMove, resizeNode, rotateNode } = useActionCreators(sceneActions)

  const initialAngleRef = useRef(0)
  const initialRotationRef = useRef(0)

  useDragHandle(overlayRef, {
    onDragStart: (handle, point, nodes) => {
      if (handle === 'rotate' && nodes.length > 0) {
        const center = nodes.length === 1 ? getNodeCenter(nodes[0]) : getGroupCenter(nodes)

        initialAngleRef.current = getAngle(point, center)
        initialRotationRef.current = nodes.length === 1 ? (nodes[0].rotation ?? 0) : 0
      }
    },
    onDrag: (handle, dx, dy, point, nodes) => {
      if (nodes.length === 0) return

      if (handle === 'rotate') {
        const center = nodes.length === 1 ? getNodeCenter(nodes[0]) : getGroupCenter(nodes)

        const angle = getAngle(point, center) - initialAngleRef.current + initialRotationRef.current

        nodes.forEach((node) => {
          rotateNode({ id: node.id, angle })
        })
        return
      }

      nodes.forEach((node) => {
        resizeNode({ id: node.id, dx, dy, handle })
      })
    },
    onDragEnd: (snapshot) => {
      commitMove(snapshot)
    },
  })
}
