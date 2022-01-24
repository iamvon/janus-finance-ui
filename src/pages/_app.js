import '/src/styles/index.scss'
import 'tailwindcss/tailwind.css'
import 'animate.css'
import { SkeletonTheme } from 'react-loading-skeleton'
import Navigation from "/src/components/common/Navigation"
import Footer from "/src/components/common/Footer"
import PageHeader from "/src/components/common/PageHeader"
import router from "next/router"
import NProgress from "nprogress"
import { useState } from "react";
import AppContext from "../contexts/AppContext"
import { SolanaContextProvider } from '../contexts/SolanaContextProvider';
require('@solana/wallet-adapter-react-ui/styles.css');
import { JupiterProvider } from "@jup-ag/react-hook";
import {
    ConnectionProvider,
    useConnection,
    useWallet,
  } from "@solana/wallet-adapter-react";
  
// const WalletProvider = dynamic(
//     () => import("../../"),
//     {
//         ssr: false,
//     }
// );

router.events.on("routeChangeStart", (url, { shallow }) => {
    if (!shallow) NProgress.start()
})
router.events.on("routeChangeComplete", (url, { shallow }) => {
    if (!shallow) NProgress.done()
})
router.events.on("routeChangeError", (url, { shallow }) => {
    if (!shallow) NProgress.done()
})


const App = ({ Component, pageProps }) => {
    const [searchQuery, setSearchQuery] = useState("")
    return (
        <SolanaContextProvider>
            {/* <JupiterWrapper> */}
                <AppContext.Provider value={{
                    searchQuery,
                    setSearchQuery
                }}>
                    <SkeletonTheme color="#e6e6e6">
                        <PageHeader />
                        <Navigation />
                        <div className="janus-bg" />
                        <Component {...pageProps} />
                        <Footer />
                    </SkeletonTheme>
                </AppContext.Provider>
            {/* </JupiterWrapper> */}
        </SolanaContextProvider>
    )
}

const JupiterWrapper = ({ children }) => {
    const { connection } = useConnection();
    const wallet = useWallet();
    return (
        <JupiterProvider
            cluster="mainnet-beta"
            connection={connection}
            // userPublicKey={wallet.publicKey || undefined}
        >
            {children}
        </JupiterProvider>
    );
};

export default App
