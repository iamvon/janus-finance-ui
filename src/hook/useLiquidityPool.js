import { useEffect, useState } from 'react';
import {liquidityPoolMapping} from '../utils/const'
import axios from 'axios';

const fetchData = async () => {
    const response = await axios.get('https://api.sonar.watch/latest')
    const {data, status} = response
    return data
}

export const useLiquidityPool = () => {
    const [pools, setPools] = useState({})
    const [farms, setFarms] = useState({})
    const [prices, setPrices] = useState({})
    const [tokens, setTokens] = useState({})
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const getPoolByMint = (mint) => {
        return pools[mint]
    }

    useEffect(() => {
        setLoading(true)
        fetchData().then((response) => {
            const {pools, farms, prices, tokens} = response
            setPools(pools)
            setTokens(tokens)
            setFarms(farms)
            setPrices(prices)
            setLoading(false)
        }).catch(err => {
            console.log(err)
            setError(err.message)
            setLoading(false)
        })
    }, []);

    return {
        pools,
        farms,
        prices,
        tokens,
        error,
        loading,
        getPoolByMint
    }
}