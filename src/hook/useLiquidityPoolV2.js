import { useEffect, useState } from 'react';
import {liquidityPoolMapping} from '../utils/const'
import axios from 'axios';

const fetchRaydiumPool = async () => {
    const response = await axios.get('https://api.raydium.io/pairs')
    const {status, data} = response
    return data
}

const fetchOrcaPool = async () => {
    const response = await axios.get('https://api.orca.so/allPools')
    const {status, data} = response
    return data
}

const fetchData = () => {
    return Promise.all([fetchRaydiumPool(), fetchOrcaPool()])
}

export const useLiquidityPoolV2 = () => {
    const [raydiumPools, setRaydiumPools] = useState([])
    const [orcaPools, setOrcaPools] = useState({})
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const getRaydiumPair = (mint) => {
        const pair = raydiumPools.find(pair => pair.lp_mint === mint) 
        if (!pair) return null
        return {
            name: pair.name,
            price: pair.lp_price,
            apy: pair.apy,
            mint: pair.lp_mint
        }
    }

    const getOrcaPair = (pair) => {
        const data = orcaPools[pair] ? orcaPools[pair] 
            : orcaPools[`${pair}[aquafarm]`] ? orcaPools[`${pair}[aquafarm]`] 
            : orcaPools[`${pair}[stable]`] ? orcaPools[`${pair}[stable]`] : orcaPools[`${pair}[stable][aquafarm]`]
        console.log(data)
        const tokens = pair.slice(0, pair.indexOf('[') + 1).split('/')
        console.log(data, tokens)
        if (!data) return null
        return {
            name: data.poolId,
            price: 0,
            apy: data.apy,
            mint: data.poolAccount
        }
    }

    const getPoolPair = (mint, pair) => {
        if (getOrcaPair(pair)) return getOrcaPair(pair)
        if (getRaydiumPair(mint)) return getRaydiumPair(mint)
        return null
    }

    useEffect(() => {
        setLoading(true)
        fetchData().then(result => {
            console.log(result)
            setRaydiumPools(result[0])
            setOrcaPools(result[1])
            setLoading(false)
        }).catch(err => {
            console.log(err.message)
            setError(err.message)
            setLoading(false)
        })
    }, []);

    return {
        raydiumPools,
        orcaPools,
        error,
        loading,
        getPoolPair
    }
}