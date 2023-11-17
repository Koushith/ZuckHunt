import App from "@/App"
import { HomeScreen } from "@/screens"
import { createBrowserRouter } from "react-router-dom"

export const routerConfig = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <HomeScreen />,
      },
    ],
  },
])
