import styled from "styled-components"
import Nouns from "../../assets/game-assets/nouns.svg"
import { ProfileContainer } from "./profile.style"
import { QuestCard } from "../../components/card/card.component"

export const ProfileScreen = () => {
  return (
    <ProfileContainer>
      <CardContainer className='card'>
        <img src={Nouns} alt='nouns' />
        <div className='info'>
          <h2>Koushith.lens</h2>
          <p>12 Quests🏆</p>
        </div>
      </CardContainer>
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
