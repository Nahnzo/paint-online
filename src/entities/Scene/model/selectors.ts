import { RootState } from 'app/providers/StoreProvider/store'

export const getShapesSelector = (state: RootState) => state.scene.nodes ?? []

export const getSelectedIdsSelector = (state: RootState) => state.scene.selectedNodesIds ?? []
