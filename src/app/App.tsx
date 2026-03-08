import { useRef } from 'react'
import { Canvas, canvasActions } from 'entities/Canvas'
import { Brush } from 'entities/Brush'
import { Toolbar } from 'widgets/Toolbar'
import { ResetCanvas } from 'features/CanvasFeatures'
import { ActiveToolCanvas } from 'widgets/ActiveToolCanvas'
import { Shape } from 'entities/Shape'
import { MousePointer2 } from 'lucide-react'
import { useActionCreators } from 'shared/hooks/hooks'
import { FillBucket } from 'entities/FillBucket'
import './index.css'
import { Redo, Undo } from 'features/SceneFeatures'

function App() {
  const baseRef = useRef<HTMLCanvasElement>(null)
  const overlayRef = useRef<HTMLCanvasElement>(null)
  const canvasAction = useActionCreators(canvasActions)

  return (
    <div className="canvasContainer">
      <Toolbar position="left">
        <ActiveToolCanvas />
      </Toolbar>
      <Toolbar position="top">
        <MousePointer2 onClick={() => canvasAction.setCanvasMode('select')} cursor="pointer" />
        <Brush />
        <Shape />
        <FillBucket />
        <Redo />
        <Undo />
        <ResetCanvas baseRef={baseRef} overlayRef={overlayRef} />
      </Toolbar>
      <Canvas baseRef={baseRef} overlayRef={overlayRef} />
    </div>
  )
}

export default App
