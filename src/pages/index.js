/* eslint-disable @next/next/no-img-element */
import React, {useEffect} from "react"
import PageHeader from "/src/components/common/PageHeader"
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faArrowAltCircleRight, faClock, faLongArrowAltRight} from '@fortawesome/free-solid-svg-icons'
import {useRouter} from 'next/router'
import Paths from "../lib/routes/Paths";
import controlPanelSvg from '../../public/control_panel.svg'

const Dashboard = (props) => {
    const {someVars} = props

    const router = useRouter()

    useEffect(() => {

    }, [])

    return (
        <div className="wrapper flex flex-col items-stretch justify-start space-y-12 pb-12">
            <PageHeader title={"Dashboard"}/>
            <div className="pt-24">
                <div className="container px-3 mx-auto flex flex-wrap flex-col md:flex-row items-center">
                    <div className="flex flex-col w-full md:w-1/2 justify-center items-start text-center md:text-left">
                        <p className="uppercase tracking-loose w-full">Welcome to Janus !</p>
                        <h1 className="my-4 text-5xl font-bold leading-tight">Token Shopping Gateway</h1>
                        <p className="leading-normal text-2xl mb-8">Find the best defi opportunities and optimizing your
                            digital assets on Solana ecosystem</p>
                        {/*<button*/}
                        {/*    className="mx-auto lg:mx-0 hover:underline bg-white text-gray-800 font-bold rounded-full my-6 py-4 px-8 shadow-lg focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out">*/}
                        {/*    Subscribe*/}
                        {/*</button>*/}
                    </div>
                    <div className="w-full md:w-1/2 py-6 text-center">
                        <img className="w-full md:pl-20 z-50" src={'/control_panel.svg'} alt={''}/>
                    </div>
                </div>
            </div>
            {/*<div className="relative -mt-12 lg:-mt-24 text-right">*/}
            {/*    <img src={controlPanelSvg} alt=""/>*/}
            {/*</div>*/}
        </div>
    )
}


export const getServerSideProps = async (context) => {
    return {
        props: {}
    }
}


export default Dashboard
