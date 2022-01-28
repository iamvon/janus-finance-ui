import { useEffect, useState } from 'react';
import {SonarWatchEnpoint} from '../utils/const'
import axios from 'axios';
import { scanTokenByPK } from '../utils/token';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';

export const useSolWalletScan = () => {
    const [tokens, setTokens] = useState([])
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const { connection } = useConnection();
    const { publicKey } = useWallet();

    useEffect(() => {
        setLoading(true)
        if (publicKey) {
            scanTokenByPK(connection, publicKey.toString()).then((result) => {
                setLoading(false)
                setTokens(walletAssets)
            }).catch(err => {
                console.log(err)
                setError(err.message)
                setLoading(false)
            })
        }
        
    }, [setTokens, setLoading, setError, connection, publicKey]);

    return {
        tokens,
        loading,
        error
    }
}