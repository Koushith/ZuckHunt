import styled from "styled-components"
import Nouns from "../../assets/game-assets/nouns.svg"

export const QuestCard = (props) => {
  // use this
  const { name, hint, image } = props
  return (
    <CardContainer className='card'>
      <img src={Nouns} alt='nouns' />
      <div className='info'>
        <h2>Name</h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Error, illo.
        </p>
      </div>
    </CardContainer>
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
  }
  background-color: #fff;
  .info {
    p {
      font-size: 14px;
      color: #646464;
    }
  }
`
