import styled from "styled-components"
import { TopBar } from "../../components/common/navbar.component"
import Nouns from "../../assets/game-assets/nouns.svg"
import { ViewQuestContainer } from "./view-quest.styles"

export const ViewQuestsScreen = () => {
  return (
    <ViewQuestContainer>
      {/* <TopBar /> */}

      <div className='main-container'>
        <h1>All Quests</h1>

        <div>
          {/* <h1>some info</h1> */}

          <div className='container'>
            <div className='card'>
              <img src={Nouns} alt='nouns' />
              <div className='info'>
                <h2>Name</h2>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                  Error, illo. Lorem ipsum dolor sit amet, consectetur
                  adipisicing elit. Error, illo.
                </p>
              </div>
            </div>

            <div className='card'>
              <img src={Nouns} alt='nouns' />
              <div className='info'>
                <h2>Name</h2>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                  Error, illo. Lorem ipsum dolor sit amet, consectetur
                  adipisicing elit. Error, illo.
                </p>
              </div>
            </div>

            <div className='card'>
              <img src={Nouns} alt='nouns' />
              <div className='info'>
                <h2>Name</h2>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                  Error, illo. Lorem ipsum dolor sit amet, consectetur
                  adipisicing elit. Error, illo.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ViewQuestContainer>
  )
}
