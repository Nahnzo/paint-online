import { ActionCreatorsMapObject, bindActionCreators } from '@reduxjs/toolkit'
import { AppDispatch, RootState } from 'app/providers/StoreProvider/store'
import { useDispatch, useSelector } from 'react-redux'

export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()

export const useActionCreators = <T extends ActionCreatorsMapObject>(actions: T): T => {
  const dispatch = useAppDispatch()
  return bindActionCreators(actions, dispatch)
}
