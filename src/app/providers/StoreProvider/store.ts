import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { brushReducer } from 'entities/Brush'
import { canvasReducer } from 'entities/Canvas'
import { sceneReducer } from 'entities/Scene'
import { syncSettingsMiddleware } from './middleware/syncSettingsMiddleware'

const rootReducer = combineReducers({
  brush: brushReducer,
  canvas: canvasReducer,
  scene: sceneReducer,
})

export type RootState = ReturnType<typeof rootReducer>

function isValidPreloadedState(value: unknown): value is Partial<RootState> {
  if (typeof value !== 'object' || value === null) return false

  const obj = value as Record<string, unknown>
  const keys: (keyof RootState)[] = ['brush', 'canvas', 'scene']

  // допускаем частичное состояние, но каждый присутствующий ключ
  // должен быть объектом (простая защита от совсем битых данных)
  return keys.every((key) => {
    if (!(key in obj)) return true
    return typeof obj[key] === 'object' && obj[key] !== null
  })
}

function loadPreloadedState(): Partial<RootState> | undefined {
  const saved = localStorage.getItem('toolSettings')
  if (!saved) return undefined

  try {
    const parsed = JSON.parse(saved)
    if (isValidPreloadedState(parsed)) {
      return parsed
    }
    console.warn('toolSettings in localStorage has invalid shape, ignoring')
    return undefined
  } catch (e) {
    console.warn('Failed to parse toolSettings from localStorage', e)
    return undefined
  }
}

export const store = configureStore({
  reducer: rootReducer,
  preloadedState: loadPreloadedState(),
  middleware: (getDefault) => getDefault().concat(syncSettingsMiddleware),
})

export type AppDispatch = typeof store.dispatch
