import React from 'react'
import { useActionCreators } from 'shared/hooks/hooks'
import { DEFAULT_BACKGROUND_CANVAS_VALUE } from 'shared/consts/consts'
import { canvasActions } from 'entities/Canvas'
import { sceneActions } from 'entities/Scene/model/slice'
interface ResetCanvas {
  baseRef: React.RefObject<HTMLCanvasElement>
  overlayRef: React.RefObject<HTMLCanvasElement>
}

const ResetCanvas = ({ baseRef, overlayRef }: ResetCanvas) => {
  const canvasColorActions = useActionCreators(canvasActions)
  const sceneAction = useActionCreators(sceneActions)

  const resetCanvas = () => {
    ;[baseRef.current, overlayRef.current].forEach((canvas) => {
      if (!canvas) return
      const ctx = canvas.getContext('2d')
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      sceneAction.clearShapes()
    })
    canvasColorActions.setBackgroundColor(DEFAULT_BACKGROUND_CANVAS_VALUE)
  }

  return <button onClick={resetCanvas}>Reset</button>
}

export default ResetCanvas
