import { useState, useEffect } from "react"
import Map from "react-map-gl"
import maplibregl from "maplibre-gl"
// interface Coordinates {
//   latitude: number
//   longitude: number
// }

export const HomeScreen = () => {
  const [location, setLocation] = useState({
    latitude: 41.04628595126438,
    longitude: 41.04628595126438,
  })

  const getCordinates = () => {
    console.log("get cordinates")
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log("position", position)
          const { latitude, longitude } = position.coords
          console.log("latitude and long", latitude, latitude)
          setLocation({ latitude, longitude })
        },
        (error) => {
          console.error("Error getting geolocation:", error.message)
        }
      )
    } else {
      console.error("Geolocation is not supported by your browser")
    }
  }

  useEffect(() => {
    getCordinates()
  }, [])

  console.log("location", location)
  return (
    <Map
      mapboxAccessToken='pk.eyJ1Ijoia291c2hpdGhhbWluIiwiYSI6ImNscDJud2ozYjB0bmUya3F5NXFhY3Z5YjUifQ.SzMv8PiyhVZAUx4pF95lMw'
      initialViewState={{
        longitude: location?.longitude ? location?.longitude : 41.05569,
        latitude: location?.latitude ? location?.latitude : 28.39172,
        zoom: 14,
      }}
      // mapLib={maplibregl}
      style={{ width: "100vw", height: "100vh" }}
      mapStyle='mapbox://styles/koushithamin/clp2sipms008s01qx1sova0mv'
    />
  )
}
