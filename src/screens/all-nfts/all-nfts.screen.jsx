import styled from "styled-components"
import { TopBar } from "../../components/common/topbar.component"
import { backendUrl } from "../../constants"
import { useEffect, useState } from "react"

export const AllNftsScreen = () => {
  const [nfts, setNfts] = useState([])
  const fetchAllNFTs = async () => {
    try {
      const data = await fetch(
        `https://2e79-212-175-155-170.ngrok-free.app/data`,
        {
          headers: new Headers({
            "ngrok-skip-browser-warning": "69420",
          }),
        }
      )
      console.log(data)
      const res = await data.json()
      console.log(res)
      setNfts(res)
    } catch (error) {
      console.log("something went wrong", error)
    }
  }

  useEffect(() => {
    fetchAllNFTs()
  }, [])

  return (
    <AllNFTContainer>
      <TopBar />
      <h1 style={{ marginLeft: "10px", fontSize: "20px" }}>All NFTS</h1>

      <div className='nfts'>
        {nfts.length > 0 ? (
          <>
            {nfts.map((nft) => (
              <div className='card'>
                <img src={nft.tokenURI} />

                <h2>{nft.owner}</h2>
                <p>{nft.id}</p>
              </div>
            ))}
          </>
        ) : (
          <>Loading</>
        )}
      </div>
    </AllNFTContainer>
  )
}

const AllNFTContainer = styled.div`
  font-family: "Londrina Solid", "sans-serif";
  .nfts {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    padding: 10px;

    .card {
      min-width: 300px;
      border-radius: 4px;
      border: 1px solid #79809c;
      padding: 10px;
      img {
        width: 100%;
      }

      h2 {
        color: #202429;
        margin-top: 10px;
      }
      p {
        color: #79809c;
      }
    }

    @media screen and (max-width: 600px) {
      grid-template-columns: repeat(1, 1fr);
    }

    @media screen and (max-width: 300px) {
      grid-template-columns: repeat(1, 1fr);
    }
  }
`
