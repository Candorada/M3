import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
let brsRoutr = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <h1>404 - Page Not Found</h1>,
  }
])
let router2 = createBrowserRouter([
  {
    path: '/assfuck',
    element: <App />,
    errorElement: <></>,
  }
])
createRoot(document.getElementById('root')).render(
  <>
  <RouterProvider router = {brsRoutr} />
  <RouterProvider router = {router2} />
  </>
  )