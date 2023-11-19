import styled from "styled-components"
import Nouns from "../../assets/game-assets/nouns.svg"

export const QuestCard = (props) => {
  // use this
  console.log(props)
  const quest = props.quest ? props.quest : {}
  const {
    questName,
    questHint,
    questHash,
    questSalt,
    questAtrName,
    questAtrType,
    questAtrImg,
  } = quest
  return (
    <CardContainer className='card'>
      <img src={`/${questAtrImg}`} alt='nouns' />
      <div className='info' style={{ border: " 2px solid #555;" }}>
        <h2
          style={{
            fontWeight: "bold",
            fontFamily: '"Londrina Solid", "sans-serif";',
          }}
        >
          {questName}
        </h2>
        <p>{questHint}</p>
      </div>
    </CardContainer>
  )
}

const CardContainer = styled.div`
  font-family: "Londrina Solid";
  gap: 10px;
  margin-bottom: 15px;
  max-width: 600px;
  display: flex;
  padding: 6px;
  border-radius: 10px;
  img {
    height: 80px;
    width: 80px;
    border-radius: 4px;
    border: 1px solid #646464;
  }
  background-color: #fff;
  .info {
    p {
      margin-top: 2px;
      font-size: 14px;
      color: #646464;
    }
  }
`
