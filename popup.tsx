import { HashRouter } from "react-router-dom"

import "./index.css"

import { App } from "./app"

function IndexPopup() {
  return (
    <div className="w-96">
      <HashRouter>
        <App />
      </HashRouter>
    </div>
  )
}

export default IndexPopup
