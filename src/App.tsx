import { useState } from "react"
import reactLogo from "./assets/react.svg"
import viteLogo from "/vite.svg"
import { Button } from "./components/ui/button"
import { Outlet } from "react-router-dom"
import { AuthProvider } from "./context/auth.context"

// layout stuff

function App() {
  return (
    <>
      <Outlet />
    </>
  )
}

export default App
