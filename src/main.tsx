import React from "react"
import ReactDOM from "react-dom/client"

import "./index.css"
import { ThemeProvider } from "./theme/theme-provider.tsx"
import { RouterProvider } from "react-router-dom"
import { routerConfig } from "./router/router.config.tsx"
import { createWeb3Modal, defaultWagmiConfig } from "@web3modal/wagmi/react"

import { WagmiConfig } from "wagmi"
import { arbitrum, mainnet } from "viem/chains"

// 1. Get projectId
const projectId = "62c53a482fac82778f1af659aa461672"

// 2. Create wagmiConfig
const metadata = {
  name: "Web3Modal",
  description: "Web3Modal Example",
  url: "https://web3modal.com",
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
}

const chains = [mainnet, arbitrum]
const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata })

// 3. Create modal
createWeb3Modal({ wagmiConfig, projectId, chains })

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <>
      <WagmiConfig config={wagmiConfig}>
        <RouterProvider router={routerConfig} />
      </WagmiConfig>
    </>
  </React.StrictMode>
)
