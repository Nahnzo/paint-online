import { useRef } from 'react'
import { Canvas, canvasActions, getCanvasMode } from 'entities/Canvas'
import { Toolbar, ToolbarSeparator } from 'widgets/Toolbar'
import { ResetCanvas } from 'features/CanvasFeatures'
import { ActiveToolCanvas, getCanvasToolType } from 'widgets/ActiveToolCanvas'
import ButtonIcon from 'shared/ui/ButtonIcon/ui/ButtonIcon'
import {
  BrushIcon,
  MousePointerIcon,
  PaintRollerIcon,
  Redo2Icon,
  Undo2Icon,
  VectorSquareIcon,
} from 'lucide-react'
import { useActionCreators, useAppSelector } from 'shared/hooks/hooks'
import { brushActions } from 'entities/Brush'
import { sceneActions } from 'entities/Scene'
import './index.css'

function App() {
  const baseRef = useRef<HTMLCanvasElement>(null)
  const overlayRef = useRef<HTMLCanvasElement>(null)
  const { redo, undo } = useActionCreators(sceneActions)
  const { setCanvasMode } = useActionCreators(canvasActions)
  const { setToolType } = useActionCreators(brushActions)
  const canvasMode = useAppSelector(getCanvasMode)
  const toolType = useAppSelector(getCanvasToolType)

  return (
    <div className="canvasContainer">
      <Toolbar position="left">
        <ActiveToolCanvas />
      </Toolbar>
      <Toolbar position="top">
        <ButtonIcon
          icon={MousePointerIcon}
          isActive={canvasMode === 'select'}
          onClick={() => {
            setCanvasMode('select')
          }}
          ariaLabel="Mouse-pointer"
        />
        <ButtonIcon
          icon={BrushIcon}
          isActive={canvasMode === 'draw' && toolType === 'brush'}
          onClick={() => {
            setToolType('brush')
            setCanvasMode('draw')
          }}
          ariaLabel="Brush-icon"
        />
        <ButtonIcon
          icon={VectorSquareIcon}
          isActive={canvasMode === 'draw' && toolType === 'rectangle'}
          onClick={() => {
            setToolType('rectangle')
            setCanvasMode('draw')
          }}
          ariaLabel="Shape-icon"
        />
        <ButtonIcon
          icon={PaintRollerIcon}
          isActive={toolType === 'paintRoller'}
          onClick={() => setToolType('paintRoller')}
          ariaLabel="Paint-roller"
        />
        <ToolbarSeparator />
        <ButtonIcon icon={Redo2Icon} onClick={() => redo()} ariaLabel="Redo" />
        <ButtonIcon icon={Undo2Icon} onClick={() => undo()} ariaLabel="Undo" />
        <ToolbarSeparator />
        <ResetCanvas baseRef={baseRef} overlayRef={overlayRef} />
      </Toolbar>
      <Canvas baseRef={baseRef} overlayRef={overlayRef} />
    </div>
  )
}

export default App
