//@ts-nocheck
import { useAddress } from "@thirdweb-dev/react"
import { createContext, useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

export const AuthContext = createContext(null)

export const AuthProvider = ({ children }: any) => {
  const [walletAddress, setWalletAddress] = useState("")
  const [isAuthorized, setIsAuthorized] = useState(false)
  const address = useAddress()

  return (
    <AuthContext.Provider
      value={{ walletAddress, setWalletAddress, isAuthorized, setIsAuthorized }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
