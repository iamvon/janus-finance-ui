/* eslint-disable @next/next/no-img-element */
import React, {useState, useEffect} from "react"
import PageHeader from "/src/components/common/PageHeader"
import {useRouter} from 'next/router'
import {useConnection, useWallet} from '@solana/wallet-adapter-react'
import {useLPTokenMap} from '../../hook/useSPLTokenMap'
import {scanTokenByPK, getAccountStake} from '../../utils/token'
import {useSolWalletScan} from '../../hook/useSolWalletScan'
import axios from 'axios'
import styles from "/src/components/portfolio/Portfolio.module.scss"
import {Select} from "antd"
import {PieChart, Pie, Sector, Tooltip, ResponsiveContainer} from 'recharts'
import {useLiquidityPool} from '../../hook/useLiquidityPool'
import {Table} from 'antd'
import {lamportsValueSolana} from '../../utils/const'
import CN from "classnames"
import NeedConnectWallet from "../../components/common/NeedConnectWallet"
import {getTokenMap} from '../../utils/token'
import {SOL_WRAPPED_ADDRESS} from '../../utils/const'


const COLUM = [
    {
        title: 'Token',
        key: 'token',
        render(record) {
            return (
                <div className={`${styles['token-cell']}`}>
                    <img className={`${styles['token-icon']}`} src={record.logoURI}/>{` `}{record.symbol}
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
                    ${record.price}
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
                return '< $0.01'
            }
            return (
                <span>
                    ${value}
                </span>
            )
        }
    }
]

const selectProps = {
    options: [{value: 'gt24h', label: 'Next 24 hours'}],
    defaultValue: 'gt24h'
}


const Portfolio = (props) => {
    const {someVars} = props
    const {connection} = useConnection()
    const {publicKey} = useWallet()

    const router = useRouter()
    const [portfolio, setPortfolio] = useState([])
    const [totalBalance, setTotalBalance] = useState(0)
    const [chartData, setChartData] = useState([])
    const [activeIndex, setActiveIndex] = useState(-1)
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
        let totalValue = 0
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
        const tokenMap = await getTokenMap()
        const solNavtiveToken = tokenMap.get(SOL_WRAPPED_ADDRESS)
        const nativeBalance = await fetchNativeBalance(publicKey)
        const tokensWithPrice = []
        if (nativeBalance > 0) {
            tokensWithPrice.push({price: tokensPrices['solana']['usd'], uiAmount: nativeBalance ,...solNavtiveToken})
        }
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
        setChartData(chart)
    }

    useEffect(() => {
        if (publicKey && !tokens.loading && !liquidityPoolLoading) {
            fetchData()
                .then(() => {
                })
                .catch(err => console.log(err.message))
        }
    }, [tokens, publicKey, liquidityPoolLoading])


    const pieCustomLabel = (props) => {
        console.log(props)
        const {
            cx,
            cy,
            midAngle,
            outerRadius,
            payload,
            fill
        } = props
        const RADIAN = Math.PI / 180
        const sin = Math.sin(-RADIAN * midAngle)
        const cos = Math.cos(-RADIAN * midAngle)
        const sx = cx + (outerRadius + 10) * cos
        const sy = cy + (outerRadius + 10) * sin
        const mx = cx + (outerRadius + 30) * cos
        const my = cy + (outerRadius + 30) * sin
        const ex = mx + (cos >= 0 ? 1 : -1) * 22
        const ey = my
        const textAnchor = cos >= 0 ? 'start' : 'end'

        return (
            <g>
                <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none"/>
                <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor}
                      fill={fill}>{payload.name}</text>
            </g>
        )
    }

    const renderActiveShape = (props) => {
        const RADIAN = Math.PI / 180
        const {cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value} = props
        const sin = Math.sin(-RADIAN * midAngle)
        const cos = Math.cos(-RADIAN * midAngle)
        const sx = cx + (outerRadius + 10) * cos
        const sy = cy + (outerRadius + 10) * sin
        const mx = cx + (outerRadius + 30) * cos
        const my = cy + (outerRadius + 30) * sin
        const ex = mx + (cos >= 0 ? 1 : -1) * 22
        const ey = my
        const textAnchor = cos >= 0 ? 'start' : 'end'

        return (
            <g>
                <Sector
                    cx={cx}
                    cy={cy}
                    innerRadius={innerRadius}
                    outerRadius={outerRadius}
                    startAngle={startAngle}
                    endAngle={endAngle}
                    fill={fill}
                />
                <Sector
                    cx={cx}
                    cy={cy}
                    startAngle={startAngle}
                    endAngle={endAngle}
                    innerRadius={outerRadius + 6}
                    outerRadius={outerRadius + 10}
                    fill={fill}
                />
                <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none"/>
                <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none"/>
                <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor}
                      fill={fill}>{payload.name}</text>
                <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill={fill}>
                    {`(Rate ${(percent * 100).toFixed(2)}%)`}
                </text>
            </g>
        )
    }

    const renderChartTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-[#FFFFFFA3] p-1.5 text-black rounded-lg">
                    <p className="label">{`${payload[0].name} : $${payload[0].value}`}</p>
                </div>
            );
        }

        return null;
    };

    if (!publicKey) {
        return (
            <div className={CN('pt-24')}>
                <NeedConnectWallet content={"Connect your wallet first to manage your portfolio"}/>
            </div>
        )
    }

    const handlerMouseEnterPie = (_, index) => {
        setActiveIndex(index)
    }

    const handlerMouseLeavePie = () => {
        setActiveIndex(-1)
    }

    return (
        <>
            <div
                className={CN('wrapper flex flex-col items-stretch justify-start space-y-12 pb-12 portfolio', styles['portfolio'])}>
                <PageHeader title={"Portfolio"}/>
                <div className={CN(styles['container'])}>
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
                                        <PieChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                                            <Pie
                                                dataKey="value"
                                                isAnimationActive={false}
                                                data={chartData}
                                                cx="50%"
                                                cy="50%"
                                                outerRadius={90}
                                                fill="#232D36"
                                                label={pieCustomLabel}
                                                activeIndex={activeIndex}
                                                activeShape={renderActiveShape}
                                                onMouseEnter={handlerMouseEnterPie}
                                                onMouseLeave={handlerMouseLeavePie}
                                            />
                                            <Tooltip content={renderChartTooltip}/>
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                            {/* chưa xử lý được dữ liệu */}
                            <div className={CN("hidden", styles['wrap'], styles['wrap-right'] )}>
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
                                        <div
                                            className={CN("flex items-center", styles['overview-value-subsection-title'])}>
                                            <div className="mr-[10px]">
                                                Estimated Total Rewards
                                            </div>
                                            <Select {...selectProps} />
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
                            <Table
                                dataSource={portfolio}
                                columns={COLUM}
                                rowClassName={CN("text-[16px] font-normal text-white")}
                            />
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
