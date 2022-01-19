import React, {useEffect, useRef, useState} from "react"
import {Dropdown} from 'antd'
import Link from "next/link"
import Paths from "/src/lib/routes/Paths"
import CN from "classnames"
import SearchBar from "./SearchBar"
import {useRouter} from "next/router"

const appMode = process.env.NEXT_PUBLIC_APP_MODE

const iconMenu = <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 7H21" stroke="#676A6C" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M3 12H21" stroke="#676A6C" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M3 17H21" stroke="#676A6C" strokeWidth="1.5" strokeLinecap="round"/>
</svg>


const overlay = () => {
    return (
        <div
            className={`flex flex-col md:flex-row items-stretch md:items-center md:w-full justify-end bg-white w-auto shadow-xl md:shadow-none rounded-md md:rounded-none p-4 md:p-0`}>
            <div className={`text-sm font-medium text-primary-font-color cursor-pointer md:mr-8 md:mb-0 mb-4`}>
                Get started
            </div>
            <div className={`text-sm font-medium text-primary-font-color cursor-pointer md:mr-8 md:mb-0 mb-4`}>
                Get started
            </div>
        </div>
    )
}

const Navigation = () => {
    const [visibleNavbar, setVisibleNavbar] = useState(true)
    const router = useRouter()

    const isActive = (menu) => {
        const pathName = router.pathname
        return pathName === menu
    }

    const leftItems = () => {
        return appMode !== 'production' ? (
            <div className={CN("flex items-center justify-between flex-row")}>
                <div className={`grid grid-cols-5 gap-2 text-sm font-semibold`}>
                    <div className={CN("col-span-1 flex justify-center cursor-pointer", {'text-blue-500': isActive('/explore')})}>
                        <Link href={Paths.Portfolio}>
                            Portfolio
                        </Link>
                    </div>
                    <div className={CN("col-span-1 flex justify-center cursor-pointer", {'text-blue-500': isActive('/collections')})}>
                        <Link href={Paths.NFT}>
                            NFT
                        </Link>
                    </div>
                    <div className="col-span-1 flex justify-center cursor-pointer" >
                        <Link href={Paths.Opportunity}>
                            Opportunity
                        </Link>
                    </div>
                    <div className={CN("col-span-1 flex justify-center cursor-pointer",{'text-blue-500' : isActive('/NFTDetail-drops')})} >
                        <Link href={Paths.Wishlist}>
                            Wishlist
                        </Link>
                    </div>
                </div>
                <div className={`w-3/5`}>
                    <SearchBar/>
                </div>
            </div>
        ) : (
            (
                <div className={CN("flex items-center justify-start text-sm font-semibold md:space-x-16 space-x-4")}>
                    <div className="text-primary-font-color cursor-pointer">
                        <Link href={Paths.Wishlist}>
                            Drops
                        </Link>
                    </div>
                </div>
            )
        )
    }

    const preYOffset = useRef(0)
    useEffect(() => {

        if (typeof window === "undefined") return

        const handleScroll = () => {
            if (window.pageYOffset > preYOffset.current && window.pageYOffset > 20) setVisibleNavbar(false)
            if (window.pageYOffset < preYOffset.current) setVisibleNavbar(true)
            preYOffset.current = window.pageYOffset
        }

        window.addEventListener('scroll', () => handleScroll())

        return () => {
            window.removeEventListener('scroll', () => handleScroll())
        }
    })

    return (
        <div
            className={`wrapper py-2 justify-between items-center sticky bg-white flex z-20 fade-transition ${!visibleNavbar ? '-top-16 opacity-0' : "top-0 opacity-100"}`}>
            <div className={`flex-shrink w-24 h-12 flex flex-row items-center md:mr-8 lg:mr-20`}>
                <div className="text-blue-500 font-bold text-3xl hover:text-blue-500">
                    <Link href={Paths.Home}>
                        Janus
                    </Link>
                </div>
            </div>
            <div className="flex-grow">
                {leftItems()}
            </div>
            <div className="md:hidden flex">
                <Dropdown overlay={overlay()} placement="bottomCenter" trigger="click">
                    {iconMenu}
                </Dropdown>
            </div>

        </div>
    )
}

export default Navigation