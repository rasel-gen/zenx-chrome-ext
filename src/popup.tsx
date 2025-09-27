import { HashRouter } from "react-router-dom"

import "./css/index.css"

import { App } from "./main"

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
