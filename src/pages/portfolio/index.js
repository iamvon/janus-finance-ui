/* eslint-disable @next/next/no-img-element */
import React, {useEffect} from "react"
import PageHeader from "/src/components/common/PageHeader"
import {useRouter} from 'next/router'
import {
    WalletConnectButton as ReactUIWalletConnectButton,
    WalletDisconnectButton as ReactUIWalletDisconnectButton,
    WalletModalButton as ReactUIWalletModalButton,
    WalletMultiButton as ReactUIWalletMultiButton,
} from '@solana/wallet-adapter-react-ui';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import {useLPTokenMap} from '../../hook/usePLTokenMap'
import {scanTokenByPK} from '../../utils/token'

const Portfolio = (props) => {
    const {someVars} = props
    const { connection } = useConnection();
    const { publicKey } = useWallet();

    const router = useRouter()

    useEffect(() => {
        if (publicKey) {
            scanTokenByPK(connection, publicKey.toString()).then(result => {
                console.log(result)
            })
        }
    }, [publicKey])

    return (
        <div className="wrapper flex flex-col items-stretch justify-start bg-gray-50 space-y-12 pb-12">
            <PageHeader title={"Portfolio"}/>
            <div>
                <ReactUIWalletDisconnectButton />
            </div>
            <div>
                <ReactUIWalletMultiButton />
            </div>
        </div>
    )
}


export const getServerSideProps = async (context) => {
    return {
        props: {}
    }
}


export default Portfolio
