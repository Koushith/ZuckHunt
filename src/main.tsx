import React from "react"
import ReactDOM from "react-dom/client"

import "./index.css"
import { ThemeProvider } from "./theme/theme-provider.tsx"
import { RouterProvider } from "react-router-dom"
import { routerConfig } from "./router/router.config.tsx"
import { createWeb3Modal, defaultWagmiConfig } from "@web3modal/wagmi/react"
import { ChakraProvider, extendTheme } from "@chakra-ui/react"

import { WagmiConfig } from "wagmi"
import { arbitrum, mainnet } from "viem/chains"
import {
  ThirdwebProvider,
  ConnectWallet,
  metamaskWallet,
  coinbaseWallet,
  walletConnect,
  localWallet,
  embeddedWallet,
} from "@thirdweb-dev/react"
import { AuthProvider } from "./context/auth.context.tsx"

// 1. Get projectId
const projectId = "62c53a482fac82778f1af659aa461672"

// thirdweb key
const thirdWebClientId = "1cfb22444a1448c43f1c91aba65c5f9a"
const thirdwebSecretKey =
  "d5Jzfh12qYl4GKFNByvgKyh0RLawEb77Wt5dnOQvrSCCIuc-mJTqM4Nqz4dnEQuerhDAEpVPU07tCaV9rUGd-w"
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
const activeChain = "goerli"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <>
      <ChakraProvider>
        <ThirdwebProvider
          autoConnect={false}
          // authConfig={{
          //   authUrl: "/auth",
          //   domain: "https://5ace-212-175-155-170.ngrok-free.app",
          // }}
          activeChain={activeChain}
          clientId={thirdWebClientId}
          supportedWallets={[
            metamaskWallet(),

            walletConnect(),
            localWallet(),

            embeddedWallet({
              auth: {
                options: ["google"],
              },
            }),
          ]}
        >
          <WagmiConfig config={wagmiConfig}>
            <>
              <RouterProvider router={routerConfig} />
            </>
          </WagmiConfig>
        </ThirdwebProvider>
      </ChakraProvider>
    </>
  </React.StrictMode>
)
