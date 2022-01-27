import { FunctionComponent, useEffect, useMemo, useState } from 'react'
import { EyeOffIcon } from '@heroicons/react/outline'
import { ChevronDownIcon } from '@heroicons/react/solid'
import { Disclosure } from '@headlessui/react'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts'
import useDimensions from 'react-cool-dimensions'
import { IconButton } from './Button'
import { LineChartIcon } from './icons'
import { useTranslation } from 'next-i18next'

dayjs.extend(relativeTime)

export const numberFormatter = Intl.NumberFormat('en', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 5,
})

const SwapTokenInfo = ({
    inputTokenId,
    outputTokenId,
}) => {
    const [chartData, setChartData] = useState([])
    const [hideChart, setHideChart] = useState(false)
    const [baseTokenId, setBaseTokenId] = useState('')
    const [quoteTokenId, setQuoteTokenId] = useState(outputTokenId)
    const [inputTokenInfo, setInputTokenInfo] = useState(null)
    const [outputTokenInfo, setOutputTokenInfo] = useState(null)
    const [mouseData, setMouseData] = useState(null)
    const [daysToShow, setDaysToShow] = useState(1)
    const { observe, width, height } = useDimensions()

    const handleMouseMove = (coords) => {
        if (coords.activePayload) {
            setMouseData(coords.activePayload[0].payload)
        }
    }

    const handleMouseLeave = () => {
        setMouseData(null)
    }

    useEffect(() => {
        // if (['usd-coin', 'tether'].includes(inputTokenId)) {
        //     setBaseTokenId(outputTokenId)
        //     setQuoteTokenId(inputTokenId)
        // } else {
        setBaseTokenId(inputTokenId)
        setQuoteTokenId(outputTokenId)
        // }
    }, [inputTokenId, outputTokenId])

    // Use ohlc data

    const getChartData = async () => {
        const inputResponse = await fetch(
            `https://api.coingecko.com/api/v3/coins/${baseTokenId}/ohlc?vs_currency=usd&days=${daysToShow}`
        )
        const outputResponse = await fetch(
            `https://api.coingecko.com/api/v3/coins/${quoteTokenId}/ohlc?vs_currency=usd&days=${daysToShow}`
        )
        const inputData = await inputResponse.json()
        const outputData = await outputResponse.json()

        const data = inputData.concat(outputData)

        const formattedData = data.reduce((a, c) => {
            const found = a.find((price) => price.time === c[0])
            if (found) {
                found.price = found.inputPrice / c[4]
            } else {
                a.push({ time: c[0], inputPrice: c[4] })
            }
            return a
        }, [])
        formattedData[formattedData.length - 1].time = Date.now()
        setChartData(formattedData.filter((d) => d.price))
    }

    // Alternative chart data. Needs a timestamp tolerance to get data points for each asset

    //   const getChartData = async () => {
    //     const now = Date.now() / 1000
    //     const inputResponse = await fetch(
    //       `https://api.coingecko.com/api/v3/coins/${inputTokenId}/market_chart/range?vs_currency=usd&from=${
    //         now - 1 * 86400
    //       }&to=${now}`
    //     )

    //     const outputResponse = await fetch(
    //       `https://api.coingecko.com/api/v3/coins/${outputTokenId}/market_chart/range?vs_currency=usd&from=${
    //         now - 1 * 86400
    //       }&to=${now}`
    //     )
    //     const inputData = await inputResponse.json()
    //     const outputData = await outputResponse.json()

    //     const data = inputData?.prices.concat(outputData?.prices)

    //     const formattedData = data.reduce((a, c) => {
    //       const found = a.find(
    //         (price) => c[0] >= price.time - 120000 && c[0] <= price.time + 120000
    //       )
    //       if (found) {
    //         found.price = found.inputPrice / c[1]
    //       } else {
    //         a.push({ time: c[0], inputPrice: c[1] })
    //       }
    //       return a
    //     }, [])
    //     setChartData(formattedData.filter((d) => d.price))
    //   }

    const getInputTokenInfo = async () => {
        const response = await fetch(
            `https://api.coingecko.com/api/v3/coins/${baseTokenId}?localization=false&tickers=false&developer_data=false&sparkline=false
      `
        )
        const data = await response.json()
        setInputTokenInfo(data)
    }

    const getOutputTokenInfo = async () => {
        const response = await fetch(
            `https://api.coingecko.com/api/v3/coins/${quoteTokenId}?localization=false&tickers=false&developer_data=false&sparkline=false
      `
        )
        const data = await response.json()
        setOutputTokenInfo(data)
    }

    useMemo(() => {
        if (baseTokenId && quoteTokenId) {
            getChartData()
        }
    }, [daysToShow, baseTokenId, quoteTokenId])

    useMemo(() => {
        if (baseTokenId) {
            getInputTokenInfo()
        }
        if (quoteTokenId) {
            getOutputTokenInfo()
        }
    }, [baseTokenId, quoteTokenId])

    // console.log("chartData", chartData)
    const chartChange = chartData.length
        ? ((chartData[chartData.length - 1]['price'] - chartData[0]['price']) /
            chartData[0]['price']) *
        100
        : 0

    return (
        <div className="ChartBox">
            {chartData.length && baseTokenId && quoteTokenId ? (
                <div className="p-5 border rounded-2xl bg-[#232D36] border-[#34434F]">

                    {
                        inputTokenInfo && outputTokenInfo && (
                            <div className="mb-4">
                                <div className="font-semibold text-sm">{`${inputTokenInfo?.symbol?.toUpperCase()}/${outputTokenInfo?.symbol?.toUpperCase()}`}</div>
                            </div>
                        )
                    }

                    <div className="flex items-start justify-between">
                        <div>
                            {mouseData ? (
                                <>
                                    <div className="font-bold text-[32px]">
                                        {numberFormatter.format(mouseData['price'])}
                                        <span
                                            className={`ml-2 text-base ${chartChange >= 0 ? 'text-[#00FFA3]' : 'text-[#DC1FFF]'
                                                }`}
                                        >
                                            {chartChange.toFixed(2)}%
                                        </span>
                                    </div>
                                    <div className="text-sm font-medium">
                                        {dayjs(mouseData['time']).format('DD MMM YY, h:mma')}
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="font-bold text-[32px]">
                                        {numberFormatter.format(
                                            chartData[chartData.length - 1]['price']
                                        )}
                                        <span
                                            className={`ml-2 text-base ${chartChange >= 0 ? 'text-[#00FFA3]' : 'text-[#DC1FFF]'
                                                }`}
                                        >
                                            {chartChange.toFixed(2)}%
                                        </span>
                                    </div>
                                    <div className="text-sm font-medium">
                                        {dayjs(chartData[chartData.length - 1]['time']).format(
                                            'DD MMM YY, h:mma'
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                        {/*<IconButton onClick={() => setHideChart(!hideChart)}>*/}
                        {/*    {hideChart ? (*/}
                        {/*        <LineChartIcon className="w-4 h-4" />*/}
                        {/*    ) : (*/}
                        {/*        <EyeOffIcon className="w-4 h-4" />*/}
                        {/*    )}*/}
                        {/*</IconButton>*/}

                        <div className="flex justify-end PresetRanges mt-2">
                            <span
                                className={`Range ${daysToShow === 1 && 'active'
                                }`}
                                onClick={() => setDaysToShow(1)}
                            >
                                24H
                            </span>
                            <span
                                className={`Range ${daysToShow === 7 && 'active'
                                }`}
                                onClick={() => setDaysToShow(7)}
                            >
                                7D
                            </span>
                            <span
                                className={`Range ${daysToShow === 30 && 'active'
                                }`}
                                onClick={() => setDaysToShow(30)}
                            >
                                30D
                            </span>
                        </div>

                    </div>
                    {!hideChart ? (
                        <div className="h-52 mt-4 w-full" ref={observe}>
                            <AreaChart
                                width={width}
                                height={height}
                                data={chartData}
                                onMouseMove={handleMouseMove}
                                onMouseLeave={handleMouseLeave}
                            >
                                <Tooltip
                                    // cursor={{
                                    //     strokeOpacity: 0,
                                    // }}
                                    content={<></>}
                                />
                                <defs>
                                    <linearGradient id="gradientArea" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor={chartChange > 0 ? "#00FFA3" : "#DC1FFF"} stopOpacity={0.9} />
                                        <stop offset="90%" stopColor={chartChange > 0 ? "#00FFA3" : "#DC1FFF"} stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <Area
                                    isAnimationActive={true}
                                    type="linear"
                                    dataKey="price"
                                    stroke={chartChange > 0 ? "#00FFA3" : "#DC1FFF"}
                                    fill="url(#gradientArea)"
                                />
                                <XAxis dataKey="time" hide />
                                <YAxis
                                    dataKey="price"
                                    type="number"
                                    domain={['dataMin', 'dataMax']}
                                    hide
                                />
                            </AreaChart>
                        </div>
                    ) : null}
                </div>
            ) : (
                <div className="bg-th-bkg-3 mt-4 md:mt-0 p-4 rounded-md text-center text-th-fgd-3">
                    <LineChartIcon className="h-6 mx-auto text-th-primary w-6" />
                    Chart not available
                </div>
            )}

            {inputTokenInfo && inputTokenId ? (
                <div className="w-full mt-6 CoinDetails">
                    <Disclosure>
                        {({ open }) => (
                            <>
                                <Disclosure.Button
                                    className={`default-transition flex items-center justify-between p-3 w-full ${open
                                        ? 'border-b-transparent rounded-b-none'
                                        : 'transform rotate-360'
                                        }`}
                                >
                                    <div className="flex items-center">
                                        {inputTokenInfo.image?.small ? (
                                            <img
                                                src={inputTokenInfo.image?.small}
                                                width="32"
                                                height="32"
                                                alt={inputTokenInfo.name}
                                            />
                                        ) : null}
                                        <div className="ml-2.5 text-left">
                                            <div className="font-semibold text-base">
                                                {inputTokenInfo?.symbol?.toUpperCase()}
                                            </div>
                                            <div className="font-normal text-th-fgd-3 text-xs">
                                                {inputTokenInfo.name}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="flex items-center">
                                            {inputTokenInfo.market_data?.current_price?.usd ? (
                                                <div className="text-sm font-medium">
                                                    $
                                                    {numberFormatter.format(
                                                        inputTokenInfo.market_data.current_price.usd
                                                    )}
                                                </div>
                                            ) : null}
                                            {inputTokenInfo.market_data
                                                ?.price_change_percentage_24h ? (
                                                <div
                                                    className={`text-sm font-medium ml-6 ${inputTokenInfo.market_data
                                                        .price_change_percentage_24h >= 0
                                                        ? 'text-th-green'
                                                        : 'text-th-red'
                                                        }`}
                                                >
                                                    {inputTokenInfo.market_data.price_change_percentage_24h.toFixed(
                                                        2
                                                    )}
                                                    %
                                                </div>
                                            ) : null}
                                        </div>
                                        <ChevronDownIcon
                                            className={`default-transition h-6 ml-7 w-6 text-th-fgd-3 ${open ? 'transform rotate-180' : 'transform rotate-360'
                                                }`}
                                        />
                                    </div>
                                </Disclosure.Button>
                                <Disclosure.Panel>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 grid-flow-row p-4 gap-4">
                                        {inputTokenInfo.market_cap_rank ? (
                                            <div className="Info">
                                                <div className="text-th-fgd-3 text-xs">
                                                    Market Cap Rank
                                                </div>
                                                <div className="font-bold text-th-fgd-1 text-lg">
                                                    #{inputTokenInfo.market_cap_rank}
                                                </div>
                                            </div>
                                        ) : null}
                                        {inputTokenInfo.market_data?.market_cap ? (
                                            <div className="Info">
                                                <div className="text-th-fgd-3 text-xs">
                                                    Market Cap
                                                </div>
                                                <div className="font-bold text-th-fgd-1 text-lg">
                                                    $
                                                    {numberFormatter.format(
                                                        inputTokenInfo.market_data?.market_cap?.usd
                                                    )}
                                                </div>
                                            </div>
                                        ) : null}
                                        {inputTokenInfo.market_data.total_volume?.usd ? (
                                            <div className="Info">
                                                <div className="text-th-fgd-3 text-xs">
                                                    24-hour Volume
                                                </div>
                                                <div className="font-bold text-th-fgd-1 text-lg">
                                                    $
                                                    {numberFormatter.format(
                                                        inputTokenInfo.market_data.total_volume?.usd
                                                    )}
                                                </div>
                                            </div>
                                        ) : null}
                                        {inputTokenInfo.market_data?.circulating_supply ? (
                                            <div className="Info">
                                                <div className="text-th-fgd-3 text-xs">
                                                    Token Supply
                                                </div>
                                                <div className="font-bold text-th-fgd-1 text-lg">
                                                    {numberFormatter.format(
                                                        inputTokenInfo.market_data.circulating_supply
                                                    )}
                                                </div>
                                                {inputTokenInfo.market_data?.max_supply ? (
                                                    <div className="text-th-fgd-2 text-xs">
                                                        Max Supply:{' '}
                                                        {numberFormatter.format(
                                                            inputTokenInfo.market_data.max_supply
                                                        )}
                                                    </div>
                                                ) : null}
                                            </div>
                                        ) : null}
                                        {inputTokenInfo.market_data?.ath?.usd ? (
                                            <div className="Info">
                                                <div className="text-th-fgd-3 text-xs">
                                                    All-Time High
                                                </div>
                                                <div className="flex">
                                                    <div className="font-bold text-th-fgd-1 text-lg">
                                                        $
                                                        {numberFormatter.format(
                                                            inputTokenInfo.market_data.ath.usd
                                                        )}
                                                    </div>
                                                    {inputTokenInfo.market_data?.ath_change_percentage
                                                        ?.usd ? (
                                                        <div
                                                            className={`ml-1.5 mt-2 text-xs ${inputTokenInfo.market_data
                                                                ?.ath_change_percentage?.usd >= 0
                                                                ? 'text-th-green'
                                                                : 'text-th-red'
                                                                }`}
                                                        >
                                                            {(inputTokenInfo.market_data?.ath_change_percentage?.usd).toFixed(
                                                                2
                                                            )}
                                                            %
                                                        </div>
                                                    ) : null}
                                                </div>
                                                {inputTokenInfo.market_data?.ath_date?.usd ? (
                                                    <div className="text-th-fgd-2 text-xs">
                                                        {dayjs(
                                                            inputTokenInfo.market_data.ath_date.usd
                                                        ).fromNow()}
                                                    </div>
                                                ) : null}
                                            </div>
                                        ) : null}
                                        {inputTokenInfo.market_data?.atl?.usd ? (
                                            <div className="Info">
                                                <div className="text-th-fgd-3 text-xs">
                                                    All-Time Low
                                                </div>
                                                <div className="flex">
                                                    <div className="font-bold text-th-fgd-1 text-lg">
                                                        $
                                                        {numberFormatter.format(
                                                            inputTokenInfo.market_data.atl.usd
                                                        )}
                                                    </div>
                                                    {inputTokenInfo.market_data?.atl_change_percentage
                                                        ?.usd ? (
                                                        <div
                                                            className={`ml-1.5 mt-2 text-xs ${inputTokenInfo.market_data
                                                                ?.atl_change_percentage?.usd >= 0
                                                                ? 'text-th-green'
                                                                : 'text-th-red'
                                                                }`}
                                                        >
                                                            {(inputTokenInfo.market_data?.atl_change_percentage?.usd).toLocaleString(
                                                                undefined,
                                                                {
                                                                    minimumFractionDigits: 0,
                                                                    maximumFractionDigits: 2,
                                                                }
                                                            )}
                                                            %
                                                        </div>
                                                    ) : null}
                                                </div>
                                                {inputTokenInfo.market_data?.atl_date?.usd ? (
                                                    <div className="text-th-fgd-2 text-xs">
                                                        {dayjs(
                                                            inputTokenInfo.market_data.atl_date.usd
                                                        ).fromNow()}
                                                    </div>
                                                ) : null}
                                            </div>
                                        ) : null}
                                    </div>
                                </Disclosure.Panel>
                            </>
                        )}
                    </Disclosure>
                </div>
            ) : (
                <div className="bg-th-bkg-3 mt-3 p-4 rounded-md text-center text-th-fgd-3">
                    Input token information is not available.
                </div>
            )}

            {outputTokenInfo && outputTokenId ? (
                <div className="w-full CoinDetails mt-4">
                    <Disclosure>
                        {({ open }) => (
                            <>
                                <Disclosure.Button
                                    className={`default-transition flex items-center justify-between p-3 w-full ${open
                                        ? 'border-b-transparent rounded-b-none'
                                        : 'transform rotate-360'
                                        }`}
                                >
                                    <div className="flex items-center">
                                        {outputTokenInfo.image?.small ? (
                                            <img
                                                src={outputTokenInfo.image?.small}
                                                width="32"
                                                height="32"
                                                alt={outputTokenInfo.name}
                                            />
                                        ) : null}
                                        <div className="ml-2.5 text-left">
                                            <div className="font-semibold text-base">
                                                {outputTokenInfo?.symbol?.toUpperCase()}
                                            </div>
                                            <div className="font-normal text-th-fgd-3 text-xs">
                                                {outputTokenInfo.name}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="flex items-center">
                                            {outputTokenInfo.market_data?.current_price?.usd ? (
                                                <div className="text-sm font-medium">
                                                    $
                                                    {numberFormatter.format(
                                                        outputTokenInfo.market_data.current_price.usd
                                                    )}
                                                </div>
                                            ) : null}
                                            {outputTokenInfo.market_data
                                                ?.price_change_percentage_24h ? (
                                                <div
                                                    className={`text-sm font-medium ml-6 ${outputTokenInfo.market_data
                                                        .price_change_percentage_24h >= 0
                                                        ? 'text-th-green'
                                                        : 'text-th-red'
                                                        }`}
                                                >
                                                    {outputTokenInfo.market_data.price_change_percentage_24h.toFixed(
                                                        2
                                                    )}
                                                    %
                                                </div>
                                            ) : null}
                                        </div>
                                        <ChevronDownIcon
                                            className={`default-transition h-6 ml-7 w-6 text-th-fgd-3 ${open ? 'transform rotate-180' : 'transform rotate-360'
                                                }`}
                                        />
                                    </div>
                                </Disclosure.Button>
                                <Disclosure.Panel>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 grid-flow-row p-4 gap-4">
                                        {outputTokenInfo.market_cap_rank ? (
                                            <div className="Info">
                                                <div className="text-th-fgd-3 text-xs">
                                                    Market Cap Rank
                                                </div>
                                                <div className="font-bold text-th-fgd-1 text-lg">
                                                    #{outputTokenInfo.market_cap_rank}
                                                </div>
                                            </div>
                                        ) : null}
                                        {outputTokenInfo.market_data?.market_cap ? (
                                            <div className="Info">
                                                <div className="text-th-fgd-3 text-xs">
                                                    Market Cap
                                                </div>
                                                <div className="font-bold text-th-fgd-1 text-lg">
                                                    $
                                                    {numberFormatter.format(
                                                        outputTokenInfo.market_data?.market_cap?.usd
                                                    )}
                                                </div>
                                            </div>
                                        ) : null}
                                        {outputTokenInfo.market_data.total_volume?.usd ? (
                                            <div className="Info">
                                                <div className="text-th-fgd-3 text-xs">
                                                    24-hour Volume
                                                </div>
                                                <div className="font-bold text-th-fgd-1 text-lg">
                                                    $
                                                    {numberFormatter.format(
                                                        outputTokenInfo.market_data.total_volume?.usd
                                                    )}
                                                </div>
                                            </div>
                                        ) : null}
                                        {outputTokenInfo.market_data?.circulating_supply ? (
                                            <div className="Info">
                                                <div className="text-th-fgd-3 text-xs">
                                                    Token Supply
                                                </div>
                                                <div className="font-bold text-th-fgd-1 text-lg">
                                                    {numberFormatter.format(
                                                        outputTokenInfo.market_data.circulating_supply
                                                    )}
                                                </div>
                                                {outputTokenInfo.market_data?.max_supply ? (
                                                    <div className="text-th-fgd-2 text-xs">
                                                        Max Supply:{' '}
                                                        {numberFormatter.format(
                                                            outputTokenInfo.market_data.max_supply
                                                        )}
                                                    </div>
                                                ) : null}
                                            </div>
                                        ) : null}
                                        {outputTokenInfo.market_data?.ath?.usd ? (
                                            <div className="Info">
                                                <div className="text-th-fgd-3 text-xs">
                                                    All-Time High
                                                </div>
                                                <div className="flex">
                                                    <div className="font-bold text-th-fgd-1 text-lg">
                                                        $
                                                        {numberFormatter.format(
                                                            outputTokenInfo.market_data.ath.usd
                                                        )}
                                                    </div>
                                                    {outputTokenInfo.market_data?.ath_change_percentage
                                                        ?.usd ? (
                                                        <div
                                                            className={`ml-1.5 mt-2 text-xs ${outputTokenInfo.market_data
                                                                ?.ath_change_percentage?.usd >= 0
                                                                ? 'text-th-green'
                                                                : 'text-th-red'
                                                                }`}
                                                        >
                                                            {(outputTokenInfo.market_data?.ath_change_percentage?.usd).toFixed(
                                                                2
                                                            )}
                                                            %
                                                        </div>
                                                    ) : null}
                                                </div>
                                                {outputTokenInfo.market_data?.ath_date?.usd ? (
                                                    <div className="text-th-fgd-2 text-xs">
                                                        {dayjs(
                                                            outputTokenInfo.market_data.ath_date.usd
                                                        ).fromNow()}
                                                    </div>
                                                ) : null}
                                            </div>
                                        ) : null}
                                        {outputTokenInfo.market_data?.atl?.usd ? (
                                            <div className="Info">
                                                <div className="text-th-fgd-3 text-xs">
                                                    All-Time Low
                                                </div>
                                                <div className="flex">
                                                    <div className="font-bold text-th-fgd-1 text-lg">
                                                        $
                                                        {numberFormatter.format(
                                                            outputTokenInfo.market_data.atl.usd
                                                        )}
                                                    </div>
                                                    {outputTokenInfo.market_data?.atl_change_percentage
                                                        ?.usd ? (
                                                        <div
                                                            className={`ml-1.5 mt-2 text-xs ${outputTokenInfo.market_data
                                                                ?.atl_change_percentage?.usd >= 0
                                                                ? 'text-th-green'
                                                                : 'text-th-red'
                                                                }`}
                                                        >
                                                            {(outputTokenInfo.market_data?.atl_change_percentage?.usd).toLocaleString(
                                                                undefined,
                                                                {
                                                                    minimumFractionDigits: 0,
                                                                    maximumFractionDigits: 2,
                                                                }
                                                            )}
                                                            %
                                                        </div>
                                                    ) : null}
                                                </div>
                                                {outputTokenInfo.market_data?.atl_date?.usd ? (
                                                    <div className="text-th-fgd-2 text-xs">
                                                        {dayjs(
                                                            outputTokenInfo.market_data.atl_date.usd
                                                        ).fromNow()}
                                                    </div>
                                                ) : null}
                                            </div>
                                        ) : null}
                                    </div>
                                </Disclosure.Panel>
                            </>
                        )}
                    </Disclosure>
                </div>
            ) : (
                <div className="bg-th-bkg-3 mt-3 p-4 rounded-md text-center text-th-fgd-3">
                    Output token information is not available.
                </div>
            )}
        </div>
    )
}

export default SwapTokenInfo
