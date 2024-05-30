// https://vike.dev/onRenderClient
export { onRenderClient }
import ReactDOM from 'react-dom/client'
import { getPageTitle } from './getPageTitle'
import type { OnRenderClientAsync } from 'vike/types'

let root: ReactDOM.Root
const onRenderClient: OnRenderClientAsync = async (pageContext): ReturnType<OnRenderClientAsync> => {
  
  const { Page } = pageContext
  const container = document.getElementById('react-root')
  if (!container) throw new Error('DOM element #react-root not found')
 

  if (container.innerHTML === '' || !pageContext.isHydration) {
    if (!root) {
      root = ReactDOM.createRoot(container)
    }
    root.render(Page)
    // SSR
  } else {
    console.log("hydrateRoot")
    root = ReactDOM.hydrateRoot(container, Page)
  }
  document.title = getPageTitle(pageContext)
}
