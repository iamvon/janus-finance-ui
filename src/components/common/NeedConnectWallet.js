/* eslint-disable @next/next/no-img-element */
import React from "react"
import {WalletMultiButton as ReactUIWalletMultiButton} from '@solana/wallet-adapter-react-ui'


const NeedConnectWallet = ({content}) => {

    const handlerOnClick = () => {
        const element = document.querySelector('.wallet-adapter-button.wallet-adapter-button-trigger')
        element.click()
    }

    return (
        <div className="flex justify-center text-white text-sf-pro">
            <div className="flex flex-col items-center">
                <img alt={"wishlist_not_found"} className="mb-10" src={'/image/wishlist_not_found.svg'}/>
                <div className="center font-normal text-[18px] text-center leading-6 mb-6">
                    {content}
                </div>
                <div>
                    <div className="hidden">
                        <ReactUIWalletMultiButton/>
                    </div>
                    <button
                        className="bg-[#00FFA328] text-[#00FFA3] text-[14px] font-bold py-[13px] px-8 rounded-[80px]"
                        onClick={handlerOnClick}
                    >
                        Connect wallet
                    </button>
                </div>
            </div>
        </div>
    )
}

export default NeedConnectWallet