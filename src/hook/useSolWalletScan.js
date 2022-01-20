import { useEffect, useState } from 'react';
import {SonarWatchEnpoint} from '../utils/const'
import axios from 'axios';
import { getTokenMap, scanTokenByPK } from '../utils/token';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';

export const useSolWalletScan = () => {
    const [tokens, setTokens] = useState([])
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const { connection } = useConnection();
    const { publicKey } = useWallet();

    useEffect(() => {
        setLoading(true)
        if (publicKey) {
            scanTokenByPK(connection, publicKey).then((result) => {
                console.log(result)
                setLoading(false)
                setTokens(result)
            }).catch(err => {
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