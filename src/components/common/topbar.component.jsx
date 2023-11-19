import Logo from "../../assets/logo2.svg"
import { useTheme } from "@/theme"
import { useNavigate } from "react-router-dom"

export const TopBar = () => {
  const { setTheme } = useTheme()
  const navigate = useNavigate()

  return (
    <div
      style={{
        fontFamily: `Londrina Solid", "sans-serif`,
        background: "#2B83F6",
        color: "#F3322C",
      }}
    >
      <div
        className='flex items-center justify-between p-4 mt-0 mb-0 ml-auto mr-auto '
        style={{ maxWidth: "1600px", height: "80px" }}
      >
        {/* <h1
          className='cursor-pointer'
          style={{ fontSize: "20px" }}
          onClick={() => navigate("/")}
        >
          ZuckHunt
        </h1> */}
        <img src={Logo} width={80} onClick={() => navigate("/")} />
        <div className='flex text-white'>
          <div className='mr-2'>
            <p
              className='cursor-pointe'
              style={{ color: "#fff" }}
              onClick={() => navigate("/all-nfts")}
            >
              All NFTS
            </p>
          </div>
          <div className='mr-2'>
            <p
              className='cursor-pointe'
              style={{ color: "#fff" }}
              onClick={() => navigate("/profile")}
            >
              Profile
            </p>
          </div>
          <div className='mr-2'>
            <p
              className='cursor-pointe'
              style={{ color: "#fff" }}
              onClick={() => navigate("/admin")}
            >
              Add Quest
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
