import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from 'app/providers/StoreProvider/store'
import App from 'app/App'

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <App />
  </Provider>,
)
