/* eslint-disable @next/next/no-img-element */
import React, {useState, useEffect} from "react"
import PageHeader from "/src/components/common/PageHeader"
import {useRouter} from 'next/router'
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import {useLPTokenMap} from '../../hook/useSPLTokenMap'
import {scanTokenByPK, getAccountStake} from '../../utils/token'
import {useSolWalletScan} from '../../hook/useSolWalletScan'
import axios from 'axios'
import styles from "./Portfolio.module.sass";
import {Select} from "antd"
import { PieChart, Pie, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import {useLiquidityPool} from '../../hook/useLiquidityPool'
import {Table} from 'antd'
import {lamportsValueSolana} from '../../utils/const'


const COLUM = [
    {
        title: 'Token',
        key: 'token',
        
        render(record) {
            return (
                <div className={`${styles['token-cell']}`}>
                    <img className={`${styles['token-icon']}`} src={record.logoURI} />{` `}{record.symbol}
                </div>
            )
        }
    },
    {
        title: 'Balance',
        sorter: (a, b) => a.uiAmount - b.uiAmount,
        render(record) {
            return (
                <span>
                    {record.uiAmount}
                </span>
            )
        }
    },
    {
        title: 'Price',
        sorter: (a, b) => a.price - b.price,
        render(record) {
            return (
                <span>
                    {record.price}
                </span>
            )
        }
    },
    {
        title: 'Value',
        sorter: (a, b) => (a.uiAmount * a.price) - (b.uiAmount * b.price),
        render(record) {
            const value = Math.floor(record.uiAmount * record.price * 100) / 100
            if (value === 0) {
                return '< 0.01'
            }
            return (
                <span>
                    {value}
                </span>
            )
        }
    },
]

const selectProps = {
    options: [{value: 'gt24h', label: 'Next 24 hours'}],
    defaultValue: 'gt24h',
};


const Portfolio = (props) => {
    const {someVars} = props
    const { connection } = useConnection();
    const { publicKey } = useWallet();

    const router = useRouter()
    const [portfolio, setPortfolio] = useState([])
    const [totalBalance, setTotalBalance] = useState(0)
    const [chartData, setChartData] = useState([])
    const {tokens, loading, error} = useSolWalletScan()
    const {
        pools: liquidityPools,
        farms: liquidityPoolFarms,
        prices: liquidityPoolPrices,
        tokens: liquidityPoolTokens,
        error: liquidityPoolError,
        loading: liquidityPoolLoading,
        getPoolByMint
    } = useLiquidityPool()

    const fetchNativeBalance = async (publicKey) => {
        const balanceLamports = await connection.getBalance(publicKey)
        return balanceLamports * lamportsValueSolana
    }

    const fetchTokenPriceByPortfolio = async (ids) => {
        let tokenIds = [...new Set([...ids, 'solana'])]
        const response = await axios.get('https://api.coingecko.com/api/v3/simple/price', {
            params: {
                ids: tokenIds.join(','),
                vs_currencies: 'usd'
            }
        })
        const {data} = response
        return data
    }

    const getLPTokenList = (tokens) => {
        const lpList = tokens.filter(token => {
            return token?.tags?.includes('lp-token')
        })
        return lpList
    }

    const getSLPTokenTotalValue = () => {
        const farmingList = getLPTokenList(tokens)
        const totalValue = 0
        farmingList.forEach(farmPair => {   
            const {mint, symbol, uiAmount} = farmPair
            const farm = getPoolByMint(mint, pair)
            if (farm?.lp?.price) {
                totalValue += uiAmount * farm.lp.price
            }
        })
        return (totalValue)
    }

    const getBalance = async (tokensPrices) => {
        const nativeBalance = await fetchNativeBalance(publicKey)
        
        const tokensWithPrice = []
        let balance = nativeBalance * tokensPrices['solana']['usd']
        tokens.forEach(token => {
            const id = token.isNative ? 'solana' : token?.extensions?.coingeckoId ? token?.extensions?.coingeckoId : token?.symbol?.toLowerCase()
            if (tokensPrices[id]) {
                const price = tokensPrices[id]['usd']
                const tokenWithPrice = {...token, price}
                tokensWithPrice.push(tokenWithPrice)
                if (price) {
                    balance += price * token.uiAmount
                }
            }
        })
        return {balance, tokensWithPrice}
    } 

    const getStakeTotalValue = async (solanaPrice) => {
        let amount = 0
        const stakeAccounts = await getAccountStake(publicKey.toString())
        for (var key of Object.keys(stakeAccounts)) {
            const stakeState = stakeAccounts[key]
            amount += parseInt(stakeState.amount)
        }
        return amount * solanaPrice * lamportsValueSolana
    }

    const fetchData = async () => {
        let tokenIds = []
        tokens.forEach((token) => {
            const id = token.isNative ? 'solana' : token?.extensions?.coingeckoId ? token?.extensions?.coingeckoId : token?.symbol?.toLowerCase() 
            if (id) {
                if (id) tokenIds.push(id)
            }
        })
        const tokensPrices = await fetchTokenPriceByPortfolio(tokenIds)
        const solanaPrice = tokensPrices['solana']['usd']
        const stakeValue = await getStakeTotalValue(solanaPrice)
        const splTokenBalance = getSLPTokenTotalValue()
        const {balance, tokensWithPrice} = await getBalance(tokensPrices)
        setTotalBalance(Math.round(balance * 100) / 100)
        setPortfolio(tokensWithPrice)
        const chart = []
        if (balance) chart.push({ name: 'Balance', value: balance, fill: '#00FFA3' })
        if (splTokenBalance) chart.push({ name: 'Yield Farming', value: splTokenBalance, fill: '#C4E20B' })
        if (stakeValue) chart.push({ name: 'Validator Staking', value: stakeValue, fill: '#DC1FFF' })
        // const chart = [
        //     // { name: 'Lending', value: 400, fill: '#007BFF' },
        //     // { name: 'Staking', value: stakeValue, fill: '#FFC107' },
        //     { name: 'Balance', value: balance, fill: '#00FFA3' },
        //     // { name: 'Liquidity', value: 200, fill: '#DC3545' },
        //     { name: 'Yield Farming', value: splTokenBalance, fill: '#C4E20B' },
        //     { name: 'Validator Staking', value: stakeValue, fill: '#DC1FFF' },
        // ];
        setChartData(chart)
    }

    useEffect(() => {
        if (publicKey && !tokens.loading && !liquidityPoolLoading) {
            fetchData()
                .then(() => {})
                .catch(err => console.log(err.message));
        }
    }, [tokens, publicKey, liquidityPoolLoading])

    return (
        <>
        <div className={`wrapper flex flex-col items-stretch justify-start bg-gray-50 space-y-12 pb-12 ${styles['portfolio']}`}>
            <PageHeader title={"Portfolio"}/>
            <div className={`pt-24 ${styles['container']}`}>
                <div className={`${styles['section']} ${styles['dashboard']}`}>
                    <div className={`${styles['section-header']}`}>
                        Dashboard
                    </div>
                    <div className={`${styles['section-content']}`}>
                        <div className={`${styles['balance']}`}>
                            <div className={`${styles['title']}`}>
                                Net worth
                            </div>
                            <div className={`${styles['account-balance']}`}>
                                ${totalBalance}
                            </div>
                        </div>
                    </div>
                </div>
                <div className={`${styles['section']} ${styles['overview']}`}>
                    <div className={`${styles['section-header']}`}>
                        Portfolio overview
                    </div>
                    <div className={`${styles['section-content']}`}>
                        <div className={`${styles['wrap']} ${styles['wrap-left']}`}>
                            <div className={`${styles['overview-chart-subsection']} ${styles['boundary']}`}>
                            <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            dataKey="value"
                                            isAnimationActive={false}
                                            data={chartData}
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={120}
                                            fill="#232D36"
                                            label
                                        />
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                        {/* chưa xử lý được dữ liệu */}
                        <div className={`${styles['wrap']} ${styles['wrap-right']}`}>
                            <div className={`${styles['overview-value-subsection']} ${styles['boundary']}`}>
                                <div className={`${styles['no-border']}`}>
                                    <div className={`${styles['overview-value-subsection-title']}`}>
                                        Value of Yielding Positions
                                    </div>
                                    <div className={`${styles['overview-value-subsection-value']}`}>
                                        $231.12
                                    </div>
                                </div>
                                <div className={`${styles['border']}`}>
                                    <div className={`${styles['overview-value-subsection-title']}`}>
                                        Total Pending Rewards  
                                    </div>
                                    <div className={`${styles['overview-value-subsection-value']}`}>
                                        $231.12
                                    </div>
                                </div>
                                <div className={`${styles['border']}`}>
                                    <div className={`${styles['overview-value-subsection-title']}`}>
                                        Estimated Total Rewards <Select {...selectProps} />
                                    </div>
                                    <div className={`${styles['overview-value-subsection-value']}`}>
                                        $0.12
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={`${styles['section']} ${styles['overview']}`}>
                    <div className={`${styles['section-header']}`}>
                        Balances
                    </div>
                    <div className={`${styles['section-content']}`}>
                        <Table dataSource={portfolio} columns={COLUM} />
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}


export const getServerSideProps = async (context) => {
    return {
        props: {}
    }
}


export default Portfolio
