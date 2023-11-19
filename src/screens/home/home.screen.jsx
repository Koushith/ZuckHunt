/* eslint-disable no-undef */
//@ts-nocheck
import React, { useRef, useEffect, useState } from "react"
import mapboxgl from "mapbox-gl"
import { Button, Flex } from "@chakra-ui/react"
import {
  createLightNode,
  createDecoder,
  waitForRemotePeer,
  Protocols,
} from "@waku/sdk"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ProtoQuestData } from "../admin/admin.screen.new"
const ContentTopic = `/zuckhunt/debug6`
const decoder = createDecoder(ContentTopic)
import { HomeContainer } from "./home.styles"
import { Quests } from "./quests.component"
import ReactMapGl from "react-map-gl"
import { WakuContentTopic } from "../../constants"

import Geohash from "latlon-geohash"

import {
  Modal,
  ModalContent,
  ModalFooter,
  ModalOverlay,
} from "@chakra-ui/react"
import { QuestCard } from "../../components/card/card.component"
import { BoxIcon, MSquare } from "lucide-react"
import { HamburgerMenuIcon, IconJarLogoIcon } from "@radix-ui/react-icons"
import { useAddress } from "@thirdweb-dev/react"
import { useNavigate } from "react-router-dom"

const salterStrig = "0123456789bcdefghjkmnpqrstuvwxyz"
export const HomeScreen = () => {
  const address = useAddress()
  const navigate = useNavigate()
  const [waku, setWaku] = useState(undefined)
  const [wakuStatus, setWakuStatus] = useState("None")
  const [selectedQuest, setSelectedQuest] = useState()
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

  // useEffect(() => {
  //   if (!address) {
  //     navigate("/auth")
  //   }
  // })

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
          setQuests([...messages])
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
    latitude: 41.0477,
    longitude: 28.987,
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
      zoom: 18.6,
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
          onAdd: async function () {
            const scale = 14
            const options = {
              obj: "/public/scene.gltf",
              type: "gltf",
              scale: { x: scale, y: scale, z: scale },
              units: "meters",
              rotation: { x: 90, y: -90, z: 0 },
            }

            tb.loadObj(options, (model) => {
              // alert(`added  ${latitude}, ${longitude}`)
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

    map.current.on("style.load", () => {
      navigator.geolocation.watchPosition(
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
    setIsModalOpen(!isModalOpen)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  return (
    <HomeContainer>
      <div className='header'>
        <h1>Zuck Hunt</h1>
        <div className='flex gap-4 items-center menu'>
          <h2 className='cursor-pointer' onClick={() => navigate("/profile")}>
            Profile
          </h2>
          <button className='btn' onClick={handleOpenModal}>
            Show Quests
          </button>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <ModalOverlay />
        <ModalContent>
          {/* pass the value */}
          <Quests
            quests={quests}
            setSelectedQuest={setSelectedQuest}
            handleCloseModal={handleCloseModal}
          />
          <ModalFooter>
            <Button
              width={"100%"}
              style={{
                fontFamily: "Londrina Solid",
                backgroundColor: "#0d6efd",
                color: "#fff",
              }}
              onClick={() => getPermissions()}
            >
              Grant Location Permission
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <div
        ref={mapContainerRef}
        id='map'
        style={{ width: "100%", height: "90vh" }}
      >
        <div
          style={{
            fontFamily: `Londrina Solid", "sans-serif`,
            position: "absolute",
            top: "78px",
            left: "6px",
            right: "6px",
            zIndex: 1,
          }}
        >
          {selectedQuest && <QuestCard quest={selectedQuest} />}
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
            />
          )}
        </div>

        <div
          style={{
            position: "absolute",
            top: "84%",
            left: "20px",
            width: "90%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Button
            width={"100%"}
            style={{
              fontFamily: "Londrina Solid",
              backgroundColor: "#0d6efd",
              color: "#fff",
              zIndex: "999",
            }}
            onClick={async () => {
              const snarkjs = window.snarkjs
              const geohash = Geohash.encode(
                location.latitude,
                location.longitude,
                6
              )
              // console.log({geohash})
              const salt = selectedQuest.questSalt
              const geohashExt = geohash + salt
              const geoHashExtIntArray = geohashExt.split("")
              const saltCharArray = salterStrig.split("")
              const geoHashExtIntArrayEncoded = geoHashExtIntArray.map((e) =>
                saltCharArray.indexOf(e)
              )
              // console.log({ "in": geoHashExtIntArrayEncoded,  "hash": selectedQuest.questHash })
              const { proof, publicSignals } = await snarkjs.groth16.fullProve(
                {
                  in: geoHashExtIntArrayEncoded,
                  hash: selectedQuest.questHash,
                },
                "circuit.wasm",
                "circuit_0000.zkey"
              )
              alert(publicSignals)
            }}
          >
            Gen Proof
          </Button>
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
          <div
            style={{
              position: "absolute",
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bottom: "-50%",
              gap: 20,
              zIndex: 1,
              padding: "20px",
            }}
          >
            <button
              onClick={() => getPermissions()}
              className='btn'
              style={{ width: "60%", background: "#9CB4B8" }}
            >
              Grant Permissions
            </button>
            <button
              className='btn'
              style={{ width: "60%" }}
              onClick={() => navigate("/profile")}
            >
              Profile
            </button>
          </div>
        </div>
      </div>
    </HomeContainer>
  )
}

function decodeMessage(wakuMessage) {
  if (!wakuMessage.payload) return

  const {
    questName,
    questHint,
    questHash,
    questSalt,
    questAtrName,
    questAtrType,
    questAtrImg,
    timestamp,
  } = ProtoQuestData.decode(wakuMessage.payload)

  // if (!timestamp || !questHint || !questName) return;

  const time = new Date()
  time.setTime(Number(timestamp))

  // const utf8Text = bytesToUtf8(text);

  return {
    questName,
    questHint,
    questHash,
    questSalt,
    questAtrName,
    questAtrType,
    questAtrImg,
    timestampInt: wakuMessage.timestamp,
  }
}
