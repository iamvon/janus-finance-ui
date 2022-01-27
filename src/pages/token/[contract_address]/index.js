/* eslint-disable @next/next/no-img-element */
import React from "react"
import PageHeader from "/src/components/common/PageHeader"
import {INPUT_MINT_ADDRESS} from "../../../constants";
import {useRouter} from 'next/router'
import JupiterForm from "/src/components/token/JupiterForm";
import {JupiterProvider} from '@jup-ag/react-hook'
import {useConnection, useWallet} from "@solana/wallet-adapter-react";

const TokenDetail = (props) => {
    const router = useRouter()

    const inputMint = INPUT_MINT_ADDRESS
    const outputMint = router.query.contract_address

    return (
        <div className="wrapper flex flex-col items-stretch justify-start space-y-12 pt-20 pb-20 text-white SingleTokenPage">
            <PageHeader title={"TokenDetail"}/>
            <JupiterWrapper>
                <JupiterForm
                    inputMintAddress={inputMint}
                    outputMintAddress={outputMint}
                />
            </JupiterWrapper>
        </div>
    )
}

const JupiterWrapper = ({children}) => {
    const {connection} = useConnection();
    const wallet = useWallet();
    return (
        <JupiterProvider
            cluster="mainnet-beta"
            connection={connection}
            userPublicKey={wallet.publicKey || undefined}
        >
            {children}
        </JupiterProvider>
    );
};

export const getServerSideProps = async (context) => {
    return {
        props: {}
    }
}

export default TokenDetail
