import { useEffect, useState } from 'react';
import {SonarWatchEnpoint} from '../utils/const'
import axios from 'axios';

export const useLPTokenMap = () => {
    const [farms, setFarms] = useState({});
    const [pools, setPools] = useState({});
    const [prices, setPrices] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        setLoading(true)
        axios
            .get(`${SonarWatchEnpoint}/latest`)
            .then(response => {
                const {data, status} = response
                const {farms, pools, prices} = data
                setFarms(farms)
                setPools(pools)
                setPrices(prices)
                setLoading(false)
            })
            .catch(err => {
                setError(err.message)
                setLoading(false)
            })
    }, [setFarms, setPools, setPrices]);

    return {
        farms,
        pools,
        prices,
        loading,
        error
    }
}