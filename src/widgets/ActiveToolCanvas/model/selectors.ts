import { RootState } from 'app/providers/StoreProvider/store'

export const getCanvasToolType = (state: RootState) => state.brush.type ?? 'brush'
