import { RootState } from 'app/providers/StoreProvider/store'

export const getShapesSelector = (state: RootState) => state.scene.shapes ?? []

export const getSelectedIdsSelector = (state: RootState) => state.scene.selectedShapeIds ?? []
