//@ts-nocheck
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Button,
  Container,
  Box,
} from "@chakra-ui/react"
import { useState, useEffect } from "react"
import "mapbox-gl/dist/mapbox-gl.css"

import protobuf from "protobufjs"
import {
  createLightNode,
  createDecoder,
  createEncoder,
  waitForRemotePeer,
  Protocols,
} from "@waku/sdk"
import "https://unpkg.com/@turf/turf@6/turf.min.js"
import { backendUrl } from "../../constants"
import { TopBar } from "../../components/common/topbar.component"
import styled from "styled-components"
import { GoogleMap, useJsApiLoader, Rectangle } from "@react-google-maps/api"
import { QuestCard } from "../../components/card/card.component"

const ContentTopic = `/zuckhunt/debug1`
const Encoder = createEncoder({ contentTopic: ContentTopic })
const decoder = createDecoder(ContentTopic)

const ProtoChatMessage = new protobuf.Type("ChatMessage")
  .add(new protobuf.Field("timestamp", 1, "uint64"))
  .add(new protobuf.Field("questName", 2, "string"))
  .add(new protobuf.Field("questHint", 3, "string"))

export const AdminScreen = () => {
  const [questName, setQuestName] = useState("")
  const [questHint, setQuestHint] = useState("")
  const [waku, setWaku] = useState(undefined)
  const [wakuStatus, setWakuStatus] = useState("None")
  // Using a counter just for the messages to be different
  const [sendCounter, setSendCounter] = useState(0)
  const [messages, setMessages] = useState([])

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyAo-Ox-40ATXXc_cBav9IC_g2OQj_6pbDc",
  })

  const [startCords, setStartCords] = useState({ lat: "", lng: "" })
  const [cords1, setCords1] = useState({ lat: "", lng: "" })
  const [cords2, setCords2] = useState({ lat: "", lng: "" })

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

  console.log("coordinates", cords1, cords2)
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(function (position) {
        setStartCords({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
      })
    }
  }, [])

  const handleMapClick = (e) => {
    const lat = e.latLng?.lat()?.toString()
    const lng = e.latLng?.lng()?.toString()

    if (!cords1.lat.length || !cords1.lng.length) {
      setCords1({ lat, lng })
    } else if (!cords2.lat.length || !cords2.lng.length) {
      setCords2({ lat, lng })
    }
  }

  useEffect(() => {
    if (wakuStatus !== "None") return

    setWakuStatus("Starting")

    createLightNode({ defaultBootstrap: true }).then((waku) => {
      waku.start().then(() => {
        setWaku(waku)
        setWakuStatus("Connecting")
      })
    })
  }, [waku, wakuStatus])

  useEffect(() => {
    if (!waku) return

    // We do not handle disconnection/re-connection in this example
    if (wakuStatus === "Connected") return

    waitForRemotePeer(waku, [
      Protocols.LightPush,
      Protocols.Filter,
      Protocols.Store,
    ]).then(() => {
      // We are now connected to a store node
      setWakuStatus("Connected")
    })
  }, [waku, wakuStatus])

  useEffect(() => {
    if (wakuStatus !== "Connected") return
    ;(async () => {
      const startTime = new Date()
      // 7 days/week, 24 hours/day, 60min/hour, 60secs/min, 100ms/sec
      startTime.setTime(startTime.getTime() - 7 * 24 * 60 * 60 * 1000)

      // TODO: Remove this timeout once https://github.com/status-im/js-waku/issues/913 is done
      await new Promise((resolve) => setTimeout(resolve, 200))

      try {
        for await (const messagesPromises of waku.store.queryGenerator(
          [decoder],
          {
            timeFilter: { startTime, endTime: new Date() },
            pageDirection: "forward",
          }
        )) {
          const messages = await Promise.all(
            messagesPromises.map(async (p) => {
              const msg = await p
              return decodeMessage(msg)
            })
          )

          console.log({ messages })
          setMessages((currentMessages) => {
            return currentMessages.concat(messages.filter(Boolean).reverse())
          })
        }
      } catch (e) {
        console.log("Failed to retrieve messages", e)
        setWakuStatus("Error Encountered")
      }
    })()
  }, [waku, wakuStatus])
  const handleNameChange = (e) => setQuestName(e.target.value)
  const handleHintChange = (e) => setQuestHint(e.target.value)
  // const handleLat1Change = (e) =>
  //   setPolygonData({ ...polygonData, lat1: e.target.value })
  // const handleLon1Change = (e) =>
  //   setPolygonData({ ...polygonData, lon1: e.target.value })
  // const handleLat2Change = (e) =>
  //   setPolygonData({ ...polygonData, lat2: e.target.value })
  // const handleLon2Change = (e) =>
  //   setPolygonData({ ...polygonData, lon2: e.target.value })

  //   const isError = input === ''
  return (
    <AppContainer>
      <TopBar />

      {/* <SideBar /> */}
      <div className='container'>
        <div className='mt-28'>
          <h1>Add New Quest</h1>
          <FormControl mt={4}>
            <FormLabel>Name</FormLabel>
            <Input type='text' value={questName} onChange={handleNameChange} />
            <FormErrorMessage>Name is required.</FormErrorMessage>
          </FormControl>

          <FormControl mt={2}>
            <FormLabel>Hint</FormLabel>
            <Input type='text' value={questHint} onChange={handleHintChange} />
            <FormErrorMessage>Hint is required.</FormErrorMessage>
          </FormControl>

          <div
            className='mt-24'
            style={{ maxWidth: "600px", marginTop: "10px" }}
          >
            <div>Select the Coordinates</div>

            {isLoaded ? (
              <>
                <div>
                  <GoogleMap
                    onClick={handleMapClick}
                    zoom={13}
                    center={startCords}
                    mapContainerStyle={{ width: "460px", height: "460px" }}
                  >
                    {cords1.lat.length &&
                      cords1.lng.length &&
                      cords2.lat.length &&
                      cords2.lng.length && (
                        <Rectangle
                          bounds={{
                            north: parseFloat(cords1.lat),
                            south: parseFloat(cords2.lat),
                            east: parseFloat(cords2.lng),
                            west: parseFloat(cords1.lng),
                          }}
                        />
                      )}
                  </GoogleMap>
                </div>
              </>
            ) : (
              <>loading</>
            )}

            {/* Submit Button */}
            <Button
              colorScheme='pink'
              variant='solid'
              mt={4}
              onClick={async () => {
                if (questHint.length < 3 || questName.length < 3) {
                  return alert("Quest Name and Hint are required.")
                }

                // Additional validation can be added if needed

                await fetch(backendUrl, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    name: questName,
                    positionData: {
                      lat1: cords1.lat,
                      lon1: cords1.lng,
                      lat2: cords2.lat,
                      lon2: cords2.lng,
                    },
                    testInput: {
                      latitude: 12973386619205718,
                      longitude: 7501257511191976,
                    },
                    hint: questHint,
                  }),
                })

                sendMessage(questName, questHint, waku).then(() =>
                  console.log("Message sent")
                )

                setSendCounter(sendCounter + 1)
              }}
            >
              Submit
            </Button>
          </div>
        </div>
        <div>
          <h1>Avaliable Nouns</h1>
          <div>
            {quests.map((q) => (
              <QuestCard quest={q} />
            ))}
          </div>
        </div>
      </div>
    </AppContainer>
  )
}

function sendMessage(questName, questHint, waku) {
  const timestamp = new Date()
  const time = timestamp.getTime()

  // Encode to protobuf
  const protoMsg = ProtoChatMessage.create({
    timestamp: time,
    questName: questName,
    questHint: questHint,
  })
  const payload = ProtoChatMessage.encode(protoMsg).finish()

  // Send over Waku Relay
  return waku.lightPush.send(Encoder, { payload })
}

function decodeMessage(wakuMessage) {
  if (!wakuMessage.payload) return

  const { timestamp, questHint, questName } = ProtoChatMessage.decode(
    wakuMessage.payload
  )

  if (!timestamp || !questHint || !questName) return

  const time = new Date()
  time.setTime(Number(timestamp))

  // const utf8Text = bytesToUtf8(text);

  return {
    questHint: questHint,
    timestamp: time,
    questName: questName,
    timestampInt: wakuMessage.timestamp,
  }
}

function Messages(props) {
  return props.messages.map(({ text, timestamp, nick, timestampInt }) => {
    return (
      <li key={timestampInt}>
        ({formatDate(timestamp)}) {nick}: {text}
      </li>
    )
  })
}

function formatDate(timestamp) {
  return timestamp.toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  })
}

const AppContainer = styled.div`
  font-family: "Londrina Solid", "sans-serif";
  margin: 0 auto;
  .container {
    display: flex;
    gap: 60px;
    margin-top: 60px;
    justify-content: center;
    h1 {
      font-size: 22px;
    }
  }
`
