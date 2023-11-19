import { Button } from "@/components/ui/button"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import { ChromeIcon } from "lucide-react"
import { TopBar } from "../../components/common/topbar.component"
import { ConnectWallet, useAddress } from "@thirdweb-dev/react"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import styled from "styled-components"

export const AuthScreen = () => {
  const address = useAddress()
  const navigate = useNavigate()
  console.log("address", address)

  useEffect(() => {
    if (address) {
      navigate("/")
    }
  }, [address])
  return (
    <AuthContainer>
      <TopBar />
      <div className='form'>
        <img src='https://nouns.wtf/static/media/noggles.7644bfd0.svg' />
        <div className='action'>
          <h1>Sign in to ZuckHunt</h1>
          <ConnectWallet />
        </div>
      </div>
    </AuthContainer>
  )
}

const AuthContainer = styled.div`
  font-family: "Londrina Solid", "sans-serif";

  .form {
    margin-top: 40%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .action {
      margin-top: 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      h1 {
        margin-bottom: 20px;
      }
    }
  }
`
