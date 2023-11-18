import App from "@/App"
import { HomeScreen ,AdminScreen} from "@/screens"
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
  {
    path: "/admin",
    element: <AdminScreen />
    
  },
])
