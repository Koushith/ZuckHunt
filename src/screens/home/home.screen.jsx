//@ts-nocheck
import React, { useEffect, useRef, useState } from "react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import ReactMapGL, { Marker } from "react-map-gl"
import { HomeContainer } from "./home.styles"
import { Quests } from "./quests.component"

import {
  Button,
  Modal,
  ModalContent,
  ModalFooter,
  ModalOverlay,
} from "@chakra-ui/react"
import { QuestCard } from "../../components/card/card.component"

export const HomeScreen = () => {
  const [location, setLocation] = useState({
    latitude: 41.04628595126438,
    longitude: 41.04628595126438,
  })
  const [isModalOpen, setIsModalOpen] = useState(false)
  const mapContainerRef = useRef(null)

  useEffect(() => {
    mapboxgl.accessToken =
      "pk.eyJ1Ijoia291c2hpdGhhbWluIiwiYSI6ImNscDJud2ozYjB0bmUya3F5NXFhY3Z5YjUifQ.SzMv8PiyhVZAUx4pF95lMw"

    // Create a new map instance
    const map = new mapboxgl.Map({
      container: mapContainerRef.current, // container ID
      style: "mapbox://styles/koushithamin/clp32pe4p01go01pm6cv7ffcf", // style URL
      center: [location.longitude, location.latitude], // starting position [lng, lat]
      zoom: 18, // starting zoom

      bearing: -12,
      pitch: 60,
      interactive: false,
    })

    // Add a marker to the map
    new mapboxgl.Marker()
      .setLngLat([location.longitude, location.latitude])
      .addTo(map)
    // adds zoom control

    map.addControl(
      new mapboxgl.NavigationControl({
        showCompass: true,
        showZoom: true,
      }),
      "top-right"
    )
    console.log(map)
    const geolocate = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
      },
      // When active the map will receive updates to the device's location as it changes.
      trackUserLocation: true,
      // Draw an arrow next to the location dot to indicate which direction the device is heading.
      showUserHeading: true,
    })
    // gets cuttent location
    map.addControl(geolocate)

    geolocate.on("geolocate", (e) => {
      console.log("A geolocate event has occurred.")
      console.log(e.coords.latitude, e.coords.longitude)
      setLocation({
        latitude: e.coords.latitude,
        longitude: e.coords.longitude,
      })
    })

    return () => {
      map.remove()
    }
  }, [location.latitude, location.longitude])

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
          style={{ position: "absolute", top: "10px", left: "10px", zIndex: 1 }}
        >
          <QuestCard />
        </div>
        <div>
          {mapboxgl && (
            <ReactMapGL
              width='100%'
              height='100%'
              latitude={location.latitude}
              longitude={location.longitude}
              zoom={18} // Adjust zoom level as needed
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
        </div>
      </div>
    </HomeContainer>
  )
}
