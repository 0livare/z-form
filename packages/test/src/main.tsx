import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './zapp.tsx'

import './reset.css'
import './index.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
