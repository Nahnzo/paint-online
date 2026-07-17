import { Middleware } from '@reduxjs/toolkit'

export const syncSettingsMiddleware: Middleware = (store) => (next) => (action) => {
  const result = next(action)

  const state = store.getState()
  localStorage.setItem('toolSettings', JSON.stringify(state))

  return result
}
