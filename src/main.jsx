import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import SetupRequired from './SetupRequired.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { isFirebaseConfigured } from './firebase.js'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {isFirebaseConfigured ? (
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    ) : (
      <SetupRequired />
    )}
  </React.StrictMode>,
)
