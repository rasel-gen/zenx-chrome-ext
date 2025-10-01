import { HashRouter, MemoryRouter } from 'react-router-dom'

import './css/index.css'

import { App } from './main'

function IndexPopup() {
  return (
    <div className="w-96 min-h-[600px]">
      <MemoryRouter>
        <App />
      </MemoryRouter>
    </div>
  )
}

export default IndexPopup
