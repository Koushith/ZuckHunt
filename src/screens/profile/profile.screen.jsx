import styled from "styled-components"
import Nouns from "../../assets/game-assets/nouns.svg"
import { ProfileContainer } from "./profile.style"
import { QuestCard } from "../../components/card/card.component"
import { useAddress } from "@thirdweb-dev/react"
import { TopBar } from "../../components/common/topbar.component"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

export const ProfileScreen = () => {
  const address = useAddress()
  const navigate = useNavigate()
  console.log(address)
  useEffect(() => {
    if (!address) {
      navigate("/auth")
    }
  }, [])

  function truncateAddress(address, maxLength = 20) {
    if (address.length > maxLength) {
      return address.substring(0, maxLength) + "..."
    }
    return address
  }
  return (
    <ProfileContainer>
      <TopBar />
      <div className='head'>
        <CardContainer className='card'>
          <img src={Nouns} alt='nouns' />
          <div className='info'>
            <h2>{address ? truncateAddress(address) : "Koushith.lens"}</h2>
            <p>12 Quests🏆</p>
          </div>
        </CardContainer>
      </div>
      <div className='quests'>
        <h1>Completed Quests</h1>
        {/* loop this */}
        <QuestCard />
        <QuestCard /> <QuestCard /> <QuestCard /> <QuestCard />
      </div>
    </ProfileContainer>
  )
}

const CardContainer = styled.div`
  gap: 10px;
  margin-bottom: 20px;
  max-width: 600px;
  display: flex;
  padding: 6px;
  border-radius: 10px;
  img {
    height: 80px;
    width: 80px;
    border-radius: 50%;
  }
  background-color: #fff;
  .info {
    margin-top: 2px;
    p {
      font-size: 14px;
      color: #646464;
    }
  }
`
