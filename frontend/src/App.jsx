import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
// import './App.css'
import ThemeProviderWrapper from './theme/ThemeProviderWrapper'
import Home from './pages/Home'
import AppRouter from './routes/AppRoutes'

function App() {

  return (
     <ThemeProviderWrapper>
      {/* <Home /> */}
      <AppRouter />
    </ThemeProviderWrapper>
  )
}

export default App
