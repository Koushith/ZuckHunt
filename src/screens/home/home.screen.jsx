import React, { useEffect, useRef, useState } from "react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import ReactMapGL, { Marker } from "react-map-gl"

export const HomeScreen = () => {
  const [location, setLocation] = useState({
    latitude: 41.04628595126438,
    longitude: 41.04628595126438,
  })

  const mapContainerRef = useRef(null)
  // console.log("mapContainerRef", mapContainerRef)
  // useEffect(() => {
  //   console.log("useEffect- get cordinates ran")
  //   if ("geolocation" in navigator) {
  //     const watchId = navigator.geolocation.watchPosition(
  //       (position) => {
  //         const { latitude, longitude } = position.coords
  //         console.log("latitude and longitude", latitude, longitude)
  //         setLocation({ latitude, longitude })
  //       },
  //       (error) => {
  //         console.error("Error getting geolocation:", error.message)
  //       },
  //       {
  //         enableHighAccuracy: true,
  //         timeout: 5000,
  //         maximumAge: 30000,
  //       }
  //     )

  //     return () => {
  //       navigator.geolocation.clearWatch(watchId)
  //     }
  //   } else {
  //     console.error("Geolocation is not supported by your browser")
  //   }
  // }, [])

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

  return (
    <div
      ref={mapContainerRef}
      id='map'
      style={{ width: "100%", height: "100vh" }}
    >
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
  )
}
