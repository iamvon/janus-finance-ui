import '/src/styles/index.scss'
import 'tailwindcss/tailwind.css'
import 'animate.css'
import {SkeletonTheme} from 'react-loading-skeleton'
import Navigation from "/src/components/common/Navigation"
import Footer from "/src/components/common/Footer"
import PageHeader from "/src/components/common/PageHeader"
import router from "next/router"
import NProgress from "nprogress"
import {useState} from "react";
import AppContext from "../contexts/AppContext"

router.events.on("routeChangeStart", (url, {shallow}) => {
    if (!shallow) NProgress.start()
})
router.events.on("routeChangeComplete", (url, {shallow}) => {
    if (!shallow) NProgress.done()
})
router.events.on("routeChangeError", (url, {shallow}) => {
    if (!shallow) NProgress.done()
})

const App = ({Component, pageProps}) => {
    const [searchQuery, setSearchQuery] = useState("")
    return (
        <AppContext.Provider value={{
            searchQuery,
            setSearchQuery
        }}>
            <SkeletonTheme color="#e6e6e6">
                <PageHeader/>
                <Navigation/>
                <div className="janus-bg"/>
                <Component {...pageProps} />
                <Footer/>
            </SkeletonTheme>
        </AppContext.Provider>
    )
}

export default App
