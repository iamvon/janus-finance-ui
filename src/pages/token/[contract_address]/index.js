/* eslint-disable @next/next/no-img-element */
import React from "react"
import PageHeader from "/src/components/common/PageHeader"
import {INPUT_MINT_ADDRESS} from "../../../constants";
import {useRouter} from 'next/router'
import JupiterForm from "/src/components/token/JupiterForm";
import {JupiterProvider} from '@jup-ag/react-hook'
import {useConnection, useWallet} from "@solana/wallet-adapter-react";
import {getDetailController} from "../../../lib/controllers/token/tokenDetail"

const TokenDetail = (props) => {
    const router = useRouter()
    const {tokenDetail} = props

    const inputMint = INPUT_MINT_ADDRESS
    const outputMint = router.query.contract_address

    return (
        <div
            className="wrapper flex flex-col items-stretch justify-start space-y-12 pt-10 lg:pt-20 pb-20 text-white SingleTokenPage">
            <PageHeader title={"Janus Exchange"}/>
            <JupiterWrapper>
                <JupiterForm
                    inputMintAddress={inputMint}
                    outputMintAddress={outputMint}
                    tokenDetail={tokenDetail}
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
    const {contract_address: contractAddress} = context.params
    const _tokenDetail = getDetailController({params: {contractAddress}})

    const [tokenDetail] = await Promise.all([
        _tokenDetail
    ])

    if (!tokenDetail) {
        return {
            notFound: true,
        }
    }

    return {
        props: {
            tokenDetail: JSON.parse(JSON.stringify(tokenDetail)),
        },
    }
}

export default TokenDetail
