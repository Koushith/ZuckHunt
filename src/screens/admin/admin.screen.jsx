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
import { TopBar } from "../../components/common/navbar.component"
import styled from "styled-components"
import { GoogleMap, useJsApiLoader, Rectangle } from "@react-google-maps/api"

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
      <div className='top-nav'>
        <TopBar />
      </div>
      <div className='main mt-6'>
        {/* <SideBar /> */}
        <div className='outlet'>
          <Container mt={8}>
            <h1>Add New Quest</h1>
            <FormControl mt={4}>
              <FormLabel>Name</FormLabel>
              <Input
                type='text'
                value={questName}
                onChange={handleNameChange}
              />
              <FormErrorMessage>Name is required.</FormErrorMessage>
            </FormControl>

            <FormControl mt={2}>
              <FormLabel>Hint</FormLabel>
              <Input
                type='text'
                value={questHint}
                onChange={handleHintChange}
              />
              <FormErrorMessage>Hint is required.</FormErrorMessage>
            </FormControl>

            <Box mt={4}>
              <div>Select the Coordinates</div>

              {/* Latitude 1 */}
              {/* <FormControl mt={2}>
                <FormLabel>Latitude 1</FormLabel>
                <Input
                  type='text'
                  value={polygonData.lat1}
                  onChange={handleLat1Change}
                />
                <FormErrorMessage>Latitude 1 is required.</FormErrorMessage>
              </FormControl> */}

              {/* Longitude 1 */}
              {/* <FormControl mt={2}>
                <FormLabel>Longitude 1</FormLabel>
                <Input
                  type='text'
                  value={polygonData.lon1}
                  onChange={handleLon1Change}
                />
                <FormErrorMessage>Longitude 1 is required.</FormErrorMessage>
              </FormControl> */}

              {/* Latitude 2 */}
              {/* <FormControl mt={2}>
                <FormLabel>Latitude 2</FormLabel>
                <Input
                  type='text'
                  value={polygonData.lat2}
                  onChange={handleLat2Change}
                />
                <FormErrorMessage>Latitude 2 is required.</FormErrorMessage>
              </FormControl> */}

              {/* Longitude 2 */}
              {/* <FormControl mt={2}>
                <FormLabel>Longitude 2</FormLabel>
                <Input
                  type='number'
                  value={polygonData.lon2}
                  onChange={handleLon2Change}
                />
                <FormErrorMessage>Longitude 2 is required.</FormErrorMessage>
              </FormControl> */}

              {/* Map */}
              {/* <div
                ref={mapContainerRef}
                id='map'
                className='mt-4'
                style={{ width: "100%", height: "100vh" }}
              >
                {mapboxgl && (
                  <ReactMapGL
                    width='100%'
                    height='100%'
                    latitude={location.latitude}
                    longitude={location.longitude}
                    zoom={18}
                    mapboxApiAccessToken={mapboxgl.accessToken}
                    mapStyle='mapbox://styles/mapbox/navigation-night-v1'
                  >
                    <Marker
                      latitude={location.latitude}
                      longitude={location.longitude}
                      offsetLeft={-20}
                      offsetTop={-10}
                    >
                      <div style={{ color: "red", fontSize: "20px" }}>📍</div>
                    </Marker>
                  </ReactMapGL>
                )}
              </div> */}
              {isLoaded ? (
                <>
                  <div>
                    <GoogleMap
                      onClick={handleMapClick}
                      zoom={13}
                      center={startCords}
                      mapContainerStyle={{ width: "100vw", height: "80vh" }}
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
            </Box>
          </Container>
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
  max-width: 1500px;
  margin: 0 auto;
  .main {
    display: flex;
    /* gap: 6rem; */
    /* padding: 2rem; */

    .outlet {
      display: flex;
      /* align-items: center; */
      justify-content: center;

      width: 100%;
    }
  }
`
