/* eslint-disable @next/next/no-img-element */
import React from "react"
import {useWallet} from "@solana/wallet-adapter-react"
import {useRouter} from "next/router"
import {WalletMultiButton as ReactUIWalletMultiButton} from '@solana/wallet-adapter-react-ui'
import Paths from "../../lib/routes/Paths"


const EmptyWishlist = () => {

    const {publicKey} = useWallet()
    const router = useRouter()

    const handlerOnClick = () => {
        if (!publicKey) {
            const element = document.querySelector('.wallet-adapter-button.wallet-adapter-button-trigger')
            element.click()
        }else{
            router.push(Paths.Tokens)
        }
    }

    return (
        <div className="flex justify-center text-white text-sf-pro">
            <div className="flex flex-col items-center">
                <img alt={"wishlist_not_found"} className="mb-10" src={'/image/wishlist_not_found.svg'}/>
                <div className="text-[24px] font-bold text-[#00FFA3] mb-4">
                    Your Wishlist is empty!
                </div>
                <div className="center font-normal text-[18px] text-center leading-6 mb-6">
                    Seems like you don’t have wishes here.
                    <br/>
                    Make a wish!
                </div>
                <div>
                    <div className="hidden">
                        <ReactUIWalletMultiButton/>
                    </div>
                    <button
                        className="bg-[#00FFA328] text-[#00FFA3] text-[14px] font-bold py-[13px] px-8 rounded-[80px]"
                        onClick={handlerOnClick}
                    >
                        Start shopping
                    </button>
                </div>
            </div>
        </div>
    )
}

export default EmptyWishlist