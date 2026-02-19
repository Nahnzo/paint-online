import { BrushChangeType } from 'features/BrushFeatures'
import { ShapeChangeType } from 'features/ShapeFeatures'
import { BrushSettings } from 'widgets/BrushSettings'
import { CircleSettings } from 'widgets/CircleSettings'
import { EraserSetting } from 'widgets/EraserSettings'
import { ShapeSettings } from 'widgets/ShapeSettings'
import { SpraySetting } from 'widgets/SpraySettings'
import { FillBucketSettings } from 'widgets/FillBucketSettings'
import { ToolType } from './types'
import { TriangleSettings } from 'widgets/TriangleSettings'

type ToolMeta = {
  changeTypeComponent?: React.ReactNode
  settingsComponent: React.ReactNode
}

export const TOOL_UI: Record<ToolType, ToolMeta> = {
  brush: {
    changeTypeComponent: <BrushChangeType />,
    settingsComponent: <BrushSettings />,
  },
  spray: {
    changeTypeComponent: <BrushChangeType />,
    settingsComponent: <SpraySetting />,
  },
  eraser: {
    changeTypeComponent: <BrushChangeType />,
    settingsComponent: <EraserSetting />,
  },
  square: {
    changeTypeComponent: <ShapeChangeType />,
    settingsComponent: <ShapeSettings />,
  },
  circle: {
    changeTypeComponent: <ShapeChangeType />,
    settingsComponent: <CircleSettings />,
  },
  triangle: {
    changeTypeComponent: <ShapeChangeType />,
    settingsComponent: <TriangleSettings />,
  },
  'fill-bucket': {
    settingsComponent: <FillBucketSettings />,
  },
}
