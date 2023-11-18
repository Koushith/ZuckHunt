/* eslint-disable no-undef */
//@ts-nocheck
import React, { useRef, useEffect, useState } from "react"
import mapboxgl from "mapbox-gl"
import { Button, Flex } from "@chakra-ui/react"
import {
  createLightNode,
  createDecoder,
  createEncoder,
  waitForRemotePeer,
  Protocols,
} from "@waku/sdk"
import { ProtoQuestData } from "../admin/admin.screen.new"
const ContentTopic = `/zuckhunt/debug6`
const Encoder = createEncoder({ contentTopic: ContentTopic })
const decoder = createDecoder(ContentTopic)
import { HomeContainer } from "./home.styles"
import { Quests } from "./quests.component"
import ReactMapGl from "react-map-gl"

import {
  Modal,
  ModalContent,
  ModalFooter,
  ModalOverlay,
} from "@chakra-ui/react"
import { QuestCard } from "../../components/card/card.component"
import { BoxIcon, MSquare } from "lucide-react"

export const HomeScreen = () => {
  const [waku, setWaku] = useState(undefined)
  const [wakuStatus, setWakuStatus] = useState("None")
  const [quests, setQuests] = useState([])

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
          setQuests((currentQuests) => {
            return currentQuests.concat(quests.filter(Boolean).reverse())
          })
        }
      } catch (e) {
        console.log("Failed to retrieve messages", e)
        setWakuStatus("Error Encountered")
      }
    })()
  }, [waku, wakuStatus])

  const mapContainer = useRef()
  let map = useRef()
  let objModel = useRef()
  const [location, setLocation] = useState({
    latitude: 41.04628595126438,
    longitude: 41.04628595126438,
  })
  const [isModalOpen, setIsModalOpen] = useState(false)
  const mapContainerRef = useRef(null)

  useEffect(() => {
    mapboxgl.accessToken =
      "pk.eyJ1Ijoic2FqamFkMjE5OTAiLCJhIjoiY2xwM3QybWZkMHhyNDJpbnJ6NzNrMno3ZSJ9.WpsQgMDeVp6LY-ORjE84zA"

    map.current = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/sajjad21990/clp3ucwk400ha01qu3edkbilp",
      center: [0, 0],
      zoom: 17.6,
      pitch: 64.9,
      bearing: 0,
      antialias: true,
    })

    const tb = (window.tb = new Threebox(
      map.current,
      map.current.getCanvas().getContext("webgl"),
      {
        defaultLights: true,
      }
    ))

    const handleGeolocationSuccess = (position) => {
      const { longitude, latitude } = position.coords
      const existingLayer = map.current.getLayer("custom-threebox-model")
      console.log({
        longitude,
        latitude,
        existingLayer,
        tb,
        model: objModel.current,
      })

      map.current.setCenter([longitude, latitude])

      if (existingLayer) {
        const model = objModel.current

        console.log("here123", model)

        if (model) {
          model.setCoords([longitude, latitude])
          tb.update()
        }
      } else {
        map.current.addLayer({
          id: "custom-threebox-model",
          type: "custom",
          renderingMode: "3d",
          onAdd: function () {
            const scale = 0.06
            const options = {
              obj: "/public/scene.gltf",
              type: "gltf",
              scale: { x: scale, y: scale, z: scale },
              units: "meters",
              rotation: { x: 90, y: -90, z: 0 },
            }

            tb.loadObj(options, (model) => {
              objModel.current = model
              model.setCoords([longitude, latitude])
              model.setRotation({ x: 0, y: 0, z: 241 })
              tb.add(model)
            })
          },

          render: function () {
            tb.update()
          },
        })
      }
    }

    const handleGeolocationError = (error) => {
      console.error("Error getting location:", error)
    }

    // const watchId = navigator.geolocation.watchPosition(
    //   handleGeolocationSuccess,
    //   handleGeolocationError
    // );

    map.current.on("style.load", () => {
      navigator.geolocation.getCurrentPosition(
        handleGeolocationSuccess,
        handleGeolocationError
      )
    })

    return () => {
      window.removeEventListener("deviceorientation", handleDeviceMotion)
      window.removeEventListener("devicemotion", () => {})
      // navigator.geolocation.clearWatch(watchId);
    }
  }, [])

  const handleDeviceMotion = (event) => {
    const tiltLR = event.gamma
    const tiltFB = event.beta

    // Update map bearing and pitch
    map.current.setBearing(tiltLR)
    map.current.setPitch(tiltFB)
  }

  const requestPermission1 = () => {
    if (
      window.DeviceOrientationEvent &&
      typeof window.DeviceOrientationEvent.requestPermission === "function"
    ) {
      window.DeviceOrientationEvent.requestPermission()
        .then((permissionState) => {
          if (permissionState === "granted") {
            window.addEventListener("deviceorientation", handleDeviceMotion)
          }
        })
        .catch(console.error)
    } else {
      // Handle regular non iOS 13+ devices
      window.addEventListener("deviceorientation", handleDeviceMotion)
    }
  }

  const requestPermission2 = () => {
    if (typeof DeviceMotionEvent?.requestPermission === "function") {
      DeviceMotionEvent.requestPermission()
        .then((permissionState) => {
          if (permissionState === "granted") {
            window.addEventListener("devicemotion", () => {})
          }
        })
        .catch(console.error)
    } else {
      // handle devices that don't need permission and those without a gyroscope
      window.addEventListener("devicemotion", () => {})
    }
  }

  const getPermissions = () => {
    requestPermission1()
    requestPermission2()
  }

  const handleOpenModal = () => {
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  return (
    <HomeContainer>
      <div className='header'>
        <h1>Zuck Hunt</h1>
        <Button className='btn' onClick={handleOpenModal}>
          Show Quests
        </Button>
      </div>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <ModalOverlay />
        <ModalContent>
          {/* pass the value */}
          <Quests />
          <ModalFooter>
            <Button
              width={"100%"}
              style={{
                fontFamily: "Londrina Solid",
                backgroundColor: "#0d6efd",
                color: "#fff",
              }}
            >
              Grant Location Permission
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <div
        ref={mapContainerRef}
        id='map'
        style={{ width: "100%", height: "100vh" }}
      >
        <div
          style={{
            position: "absolute",
            top: "78px",
            left: "6px",
            right: "6px",
            zIndex: 1,
          }}
        >
          <QuestCard />
        </div>
        <div>
          {mapboxgl && (
            <ReactMapGl
              width='100%'
              height='100%'
              latitude={location.latitude}
              longitude={location.longitude}
              zoom={18} // Adjust zoom level as needed
              mapboxApiAccessToken={mapboxgl.accessToken}
              mapStyle='mapbox://styles/mapbox/navigation-night-v1'
            >
              {/* <Marker
                latitude={location.latitude}
                longitude={location.longitude}
                offsetLeft={-20}
                offsetTop={-10}
              >
                <div style={{ color: "red", fontSize: "20px" }}>📍</div>
              </Marker> */}
            </ReactMapGl>
          )}
        </div>

        <div
          style={{
            position: "absolute",

            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bottom: "70%",
            right: "2%",
            zIndex: 1,
            padding: "20px",
          }}
        >
          <MSquare />
        </div>

        <div
          style={{
            position: "absolute",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            top: "90%",
            zIndex: 1,
            padding: "20px",
          }}
        >
          <button className='btn' style={{ width: "60%" }}>
            PICK UP
          </button>
        </div>
      </div>
    </HomeContainer>
  )
}
