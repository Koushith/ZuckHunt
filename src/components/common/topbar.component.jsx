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

  return (
    <div
      style={{
        fontFamily: `Londrina Solid", "sans-serif`,
        background: "#2B83F6",
        color: "#F3322C",
      }}
    >
      <div
        className='flex items-center justify-between p-4 mt-0 mb-0 ml-auto mr-auto '
        style={{ maxWidth: "1600px", height: "80px" }}
      >
        <h1
          className='cursor-pointer'
          style={{ fontSize: "20px" }}
          onClick={() => navigate("/")}
        >
          ZuckHunt
        </h1>
        <div className='flex text-white'>
          <div className='mr-2'>
            <p
              className='cursor-pointe'
              style={{ color: "#fff" }}
              onClick={() => navigate("/profile")}
            >
              Profile
            </p>
          </div>
          <div className='mr-2'>
            <p
              className='cursor-pointe'
              style={{ color: "#fff" }}
              onClick={() => navigate("/admin")}
            >
              Add Quest
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
