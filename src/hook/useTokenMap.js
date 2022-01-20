import React, { useEffect, useState } from 'react';
import { TokenListProvider, TokenInfo } from '@solana/spl-token-registry';
import {SOLANA_CHAIN_ID} from '../utils/const'

export const useTokenMap = () => {
    const [tokenMap, setTokenMap] = useState({});
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    useEffect(() => {
        setLoading(true)
        new TokenListProvider()
            .resolve()
            .then(tokens => {
                const tokenList = tokens.filterByChainId(SOLANA_CHAIN_ID).getList();
                setTokenMap(tokenList.reduce((map, item) => {
                    map.set(item.address, item);
                    return map;
                },{}));
            })
            .then(() => setLoading(false))
            .catch(err => {
                setError(err.message)
                setLoading(false)
            });
    }, [setTokenMap, setLoading, setError]);

    return {tokenMap, loading, error}
}