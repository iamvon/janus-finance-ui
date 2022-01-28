import React, { useEffect, useRef, useState } from "react"
import {Drawer, Dropdown} from 'antd'
import Link from "next/link"
import Paths from "/src/lib/routes/Paths"
import CN from "classnames"
import SearchBar from "./SearchBar"
import {useRouter} from "next/router"
import {WalletMultiButton as ReactUIWalletMultiButton,} from '@solana/wallet-adapter-react-ui';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faHeart} from "@fortawesome/free-regular-svg-icons"
import {useWallet} from "@solana/wallet-adapter-react"

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
    const [menuRes, setMenuRes] = useState(false)


    const router = useRouter()
    const {publicKey} = useWallet();

    // console.log(router.pathname)
    const isActive = (menu) => {
        const pathName = router.pathname
        return pathName === menu
    }

    const toggleMenuRes = () => setMenuRes(!menuRes)

    const logo = (
        <div className={`header-logo flex-shrink w-24 h-12 flex flex-row items-center`}>
            <div className="text-blue-500 font-bold text-3xl hover:text-blue-500">
                <Link href={Paths.Home}>
                    <img src={'/image/logo.png'} alt='Home'/>
                </Link>
            </div>
        </div>
    )

    const nav = (
        <>
            <div className={CN("nav-item col-span-1 cursor-pointer", { 'active': isActive('/portfolio') })}>
                <Link href={Paths.Portfolio}>
                    <a href={Paths.Portfolio}  className={`text-base font-semibold p-4 block hover:text-[#00FFA3] ${isActive("/portfolio") ? "text-[#00FFA3]" : "text-white"}`}>Portfolio</a>
                </Link>
            </div>
            <div className={CN("nav-item col-span-1 cursor-pointer", { 'active': isActive('/collections') })}>
                <Link href={Paths.Tokens}>
                    <a href={Paths.Tokens} className={`text-base font-semibold p-4 block hover:text-[#00FFA3] ${isActive("/collections") ? "text-[#00FFA3]" : "text-white"}`}>Assets</a>
                </Link>
            </div>
            <div className="nav-item col-span-1 cursor-pointer" >
                <Link href={Paths.Opportunity}>
                    <a href={Paths.Opportunity} className={`text-base font-semibold p-4 block hover:text-[#00FFA3] ${isActive("/opportunity") ? "text-[#00FFA3]" : "text-white"}`}>Opportunity</a>
                </Link>
            </div>
            {/*<div className={CN("nav-item col-span-1 cursor-pointer", { 'active': isActive('/wishlist') })} >*/}
            {/*    <Link href={Paths.Wishlist}>*/}
            {/*        Wishlist*/}
            {/*    </Link>*/}
            {/*</div>*/}
        </>
    )

    const leftItems = () => {
        return appMode !== 'production' ? (
            <>
                <div className="MobileMenu mr-4 lg:hidden">
                    <div className="IconToggleMenu" onClick={() => toggleMenuRes()}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3 18H21V16H3V18ZM3 13H21V11H3V13ZM3 6V8H21V6H3Z" fill="white"/>
                        </svg>
                    </div>

                    <Drawer
                        placement="left"
                        onClose={() => setMenuRes(false)}
                        visible={menuRes}
                        className="DrawerMobileMenu"
                        width={300}
                        closeIcon={
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4.82276 20.0004C4.612 20.0004 4.40124 19.9203 4.2411 19.7589C3.91963 19.4374 3.91963 18.9163 4.2411 18.5948L18.5948 4.2411C18.9162 3.91963 19.4374 3.91963 19.7589 4.2411C20.0804 4.56257 20.0804 5.08376 19.7589 5.40543L5.40543 19.7589C5.24409 19.9193 5.03333 20.0004 4.82276 20.0004Z" fill="#ffffff"/>
                                <path d="M19.1774 20.0004C18.9667 20.0004 18.7561 19.9203 18.5958 19.7589L4.2411 5.40543C3.91963 5.08376 3.91963 4.56257 4.2411 4.2411C4.56257 3.91963 5.08376 3.91963 5.40543 4.2411L19.7589 18.5948C20.0804 18.9163 20.0804 19.4374 19.7589 19.7589C19.5976 19.9193 19.387 20.0004 19.1774 20.0004Z" fill="#ffffff"/>
                            </svg>
                        }
                    >
                        <div className="text-white">
                            {nav}
                        </div>

                        <div className={'flex justify-center'}>
                            <ReactUIWalletMultiButton/>
                        </div>
                        {
                            !!publicKey && (
                                <div
                                    className={CN("flex justify-center items-center cursor-pointer", {'text-blue-500': isActive(Paths.Wishlist)})}>
                                    <Link href={Paths.Wishlist} passHref={true}>
                                        <FontAwesomeIcon icon={faHeart} className={CN("text-lg")}
                                                         style={{color: "#e91e63"}}/>
                                    </Link>
                                </div>
                            )
                        }
                    </Drawer>
                </div>

                {logo}

                <div className="NavigationItems hidden lg:block ml-12">
                    <div className="flex">
                        {nav}
                    </div>
                </div>

                <div className={`header-search ml-auto`}>
                    <SearchBar />
                </div>

                <div className="ml-3 lg:ml-4 hidden lg:block">
                    <div className={'flex header-button'}>
                        <ReactUIWalletMultiButton/>
                    </div>
                    {
                        !!publicKey && (
                            <div
                                className={CN("flex justify-center items-center cursor-pointer", {'text-blue-500': isActive(Paths.Wishlist)})}>
                                <Link href={Paths.Wishlist} passHref={true}>
                                    <FontAwesomeIcon icon={faHeart} className={CN("text-lg")}
                                                     style={{color: "#e91e63"}}/>
                                </Link>
                            </div>
                        )
                    }
                </div>
            </>
        ) : (
            (
                <>
                    {logo}
                    <div className={CN("flex items-center justify-start text-sm font-semibold md:space-x-16 space-x-4")}>
                        <div className="text-primary-font-color cursor-pointer">
                            <Link href={Paths.Wishlist}>
                                Drops
                            </Link>
                        </div>
                    </div>
                </>
            )
        )
    }

    return (
        <div
            className={`janus-header wrapper justify-between items-center sticky flex z-20 fade-transition ${!visibleNavbar ? '-top-16 opacity-0' : "top-0 opacity-100"}`}>
            {leftItems()}
        </div>
    )
}

export default Navigation