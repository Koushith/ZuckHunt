import App from "@/App"
import { AdminScreen, HomeScreen, ProfileScreen,AdminScreenNew } from "@/screens"
import { ViewQuestsScreen } from "@/screens/admin/view-quests.screen"
import { AuthScreen } from "@/screens/auth/auth.screen"
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
    element: <AdminScreen />,
  },
  {
    path: "/debug",
    element: <AdminScreenNew />,
  },
  {
    path: "/admin",
    element: <AdminScreen />,
  },
  {
    path: "/view-quests",
    element: <ViewQuestsScreen />,
  },
  {
    path: "/auth",
    element: <AuthScreen />,
  },
  {
    path: "/profile",
    element: <ProfileScreen />,
  },
])
