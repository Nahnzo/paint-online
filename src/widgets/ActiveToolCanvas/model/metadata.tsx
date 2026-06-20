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
import {
  BrushIcon,
  CircleIcon,
  EraserIcon,
  SprayCanIcon,
  SquareIcon,
  TriangleIcon,
} from 'lucide-react'

type ToolMeta = {
  changeTypeComponent?: React.ReactNode
  settingsComponent: React.ReactNode
  activeToolIcon?: React.ReactElement
}

export const TOOL_UI: Record<ToolType, ToolMeta> = {
  brush: {
    changeTypeComponent: <BrushChangeType />,
    settingsComponent: <BrushSettings />,
    activeToolIcon: <BrushIcon />,
  },
  spray: {
    changeTypeComponent: <BrushChangeType />,
    settingsComponent: <SpraySetting />,
    activeToolIcon: <SprayCanIcon />,
  },
  eraser: {
    changeTypeComponent: <BrushChangeType />,
    settingsComponent: <EraserSetting />,
    activeToolIcon: <EraserIcon />,
  },
  rectangle: {
    changeTypeComponent: <ShapeChangeType />,
    settingsComponent: <ShapeSettings />,
    activeToolIcon: <SquareIcon />,
  },
  circle: {
    changeTypeComponent: <ShapeChangeType />,
    settingsComponent: <CircleSettings />,
    activeToolIcon: <CircleIcon />,
  },
  triangle: {
    changeTypeComponent: <ShapeChangeType />,
    settingsComponent: <TriangleSettings />,
    activeToolIcon: <TriangleIcon />,
  },
  fillBucket: {
    settingsComponent: <FillBucketSettings />,
  },
}
