import styled from "styled-components"
import Nouns from "../../assets/game-assets/nouns.svg"
import { ProfileContainer } from "./profile.style"
import { QuestCard } from "../../components/card/card.component"
import { useAddress } from "@thirdweb-dev/react"
import { TopBar } from "../../components/common/topbar.component"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

export const ProfileScreen = () => {
  const [quests, setQuests] = useState([
    {
      questName: "Quest For  GLASSES-DEEP-TEAL",
      questHint:
        "Decentralized creativity meets ancient charm at the crossroads of East and West.",
      questHash:
        "20656012635723524036702328630164289424646510225511108340787835813842513795043",
      questSalt: "s2xuu892",
      questAtrName: "glasses-deep-teal",
      questAtrType: "glasses",
      questAtrImg: "glasses-deep-teal.png",
    },
    {
      questName: "Quest For  BG-COOL",
      questHint: "Unleash your coding magic where continents collide.",
      questHash:
        "14228942699358288528220922604750485781308244864246343118051809833184561724003",
      questSalt: "482wdp8n",
      questAtrName: "bg-cool",
      questAtrType: "bg",
      questAtrImg: "bg-cool.png",
    },
    {
      questName: "Quest For  ACCESSORY-BLING-ANVIL",
      questHint: "Hack the Bosphorus breeze with your blockchain brilliance.",
      questHash:
        "21726448918513788856913228406302511217324886587952113075363295608571349320776",
      questSalt: "834b58y6",
      questAtrName: "accessory-bling-anvil",
      questAtrType: "accessory",
      questAtrImg: "accessory-bling-anvil.png",
    },
    {
      questName: "Quest For  BODY-PEACHY-B",
      questHint: "Innovate where history and technology intertwine.",
      questHash:
        "8614960715691933623580508869231933685522103729909663513292523830737760087415",
      questSalt: "dkn6evpn",
      questAtrName: "body-peachy-B",
      questAtrType: "body",
      questAtrImg: "body-peachy-B.png",
    },
    {
      questName: "Quest For  HEAD-BELUGA.PNG",
      questHint: "Elevate your code amidst the echoes of Byzantine brilliance.",
      questHash:
        "13178095318700154901199369371168412414205596719531432013364934552841283516671",
      questSalt: "knt94pu4",
      questAtrName: "head-beluga.png",
      questAtrType: "head",
      questAtrImg: "head-beluga.png",
    },
  ])
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
        <QuestCard quest={quests[0]} />
        <QuestCard quest={quests[3]} />
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
