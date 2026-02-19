import { configureStore } from '@reduxjs/toolkit'
import { brushReducer } from 'entities/Brush'
import { canvasReducer } from 'entities/Canvas'
import { sceneReducer } from 'entities/Scene'

export const store = configureStore({
  reducer: {
    brush: brushReducer,
    canvas: canvasReducer,
    scene: sceneReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
