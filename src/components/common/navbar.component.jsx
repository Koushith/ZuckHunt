import { Button } from "@/components/ui/button"

import { ButtonIcon, HamburgerMenuIcon } from "@radix-ui/react-icons"
import { useEffect } from "react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTheme } from "@/theme"
import {
  BellIcon,
  LogOutIcon,
  Moon,
  Settings,
  Sun,
  User2Icon,
} from "lucide-react"
import { useNavigate } from "react-router-dom"

export const TopBar = () => {
  const { setTheme } = useTheme()
  const navigate = useNavigate()

  const isAdmin = true
  const isAuthendicated = true
  return (
    <div className='border-b '>
      <div
        className='flex items-center justify-between p-4 mt-0 mb-0 ml-auto mr-auto '
        style={{ maxWidth: "1600px", height: "80px" }}
      >
        <h1 className='cursor-pointer' onClick={() => navigate("/")}>
          ZuckHunt 📄
        </h1>
        <div className='flex'>
          <div className='hidden md:block'>
            {" "}
            {/* Hide on mobile */}
            {isAuthendicated ? (
              <Button
                className='bg-red-500 hover:bg-red-600'
                // onClick={logoutHandler}
              >
                Logout
              </Button>
            ) : (
              <Button
                className='bg-green-500 hover:bg-green-600'
                //  onClick={loginHandler}
              >
                Sign up
              </Button>
            )}
          </div>
          <div className='mr-2'>
            <p className='cursor-pointer' onClick={() => navigate("/admin")}>
              Add Quest
            </p>
          </div>
          <div className='pl-4'>
            <p
              className='cursor-ponter'
              onClick={() => navigate("/view-quests")}
            >
              All Quests
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
