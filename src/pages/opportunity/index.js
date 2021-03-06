/* eslint-disable @next/next/no-img-element */
import React, {useEffect, useState, useRef} from "react"
import PageHeader from "/src/components/common/PageHeader"
import {useRouter} from 'next/router'
import {connectToDatabase} from "../../lib/connections/mongodb"
import Pool from '../../lib/models/pool.model'
import {getPoolListApi} from "../../lib/services/api/pool"
import {Table, Tag, Input, Select, Button, Space} from 'antd'
import axios from 'axios'
import CN from "classnames"
import {brief_address} from "../../lib/helpers/address"
import Link from "next/link"
import CopyIcon from "../../components/common/CopyIcon"
import {faCopy, faInfo, faInfoCircle, faSearch} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {SearchOutlined} from '@ant-design/icons'
import {useSolWalletScan} from '../../hook/useSolWalletScan'
import {useConnection, useWallet} from '@solana/wallet-adapter-react'
import {renderSolscanUrl} from "../../lib/helpers/solscan"
import {renderPlatformIconUrl} from "../../lib/helpers/platform/icon"
import Image from "next/image"
import PlatformIcon from "../../components/PlatformIcon"

const rowClassName = 'hover:bg-[#232D36]'

const Opportunity = ({totalPool}) => {

    const searchInput = useRef()
    const [tableData, setTableData] = useState([])
    const [inputValue, setInputValue] = useState('')
    const [field, setField] = useState('')
    const [curFilter, setCurFilter] = useState({asset: null, platform: null})
    const [curSorter, setCurSorter] = useState({})
    const [userToken, setUserToken] = useState([])
    const [isFilterByUserTokens, setFilterByUserTokens] = useState(false)
    const [pagination, setPagination] = useState({current: 1, pageSize: 10, total: totalPool})
    const [searchedFields, setSearchedFields] = useState([])
    const {tokens, loading, error} = useSolWalletScan()
    const {connection} = useConnection()
    const {publicKey} = useWallet()
    const platformFilterRef = useRef()
    const assetFilterRef = useWallet()

    const getTokensSymbolInPortfolio = () => {
        const tokensSymbolList = []
        tokens.forEach(token => {
            if (token?.symbol) {
                tokensSymbolList.push(token?.symbol)
            }
        })
        return tokensSymbolList
    }

    const findBaseOnUserToken = () => {
        setFilterByUserTokens(true)
        const userTokens = getTokensSymbolInPortfolio()
        setUserToken(userTokens)
    }

    const findAll = () => {
        setFilterByUserTokens(false)
        setUserToken([])
    }

    const handleFetchPool = async (newPagination, filters, sorter, userToken) => {
        const size = newPagination.pageSize
        const page = newPagination.current
        let orderBy = ''
        let orderDirection = 1

        if (sorter.order) {
            orderBy = sorter.field
            orderDirection = sorter.order === 'descend' ? -1 : 1
        }

        const newFilter = {
            ...filters,
            userToken: userToken.length !== 0 ? userToken : null
        }

        const {data: res} = await axios.post('/api/pool', {
            page,
            size,
            order_by: orderBy,
            order_direction: orderDirection,
            query: newFilter
        })
        const newData = res.data.items.map((t, index) => {
            return {
                key: (page - 1) * size + index,
                ...t
            }
        })
        setPagination({current: res.data.page, pageSize: res.data.size, total: res.data.total})
        setTableData(newData)
    }

    useEffect(() => {
        handleFetchPool(pagination, curFilter, curSorter, userToken)
    }, [userToken])

    const handleTableChange = (newPagination, filters, sorter) => {
        console.log(newPagination, filters, sorter)
        setPagination({...pagination, current: newPagination.current, pageSize: newPagination.pageSize})
        setCurFilter(filters)
        setCurSorter(sorter)
        handleFetchPool(newPagination, filters, sorter, userToken) // {} {} {}
    }


    const getColumnSearchProps = (dataIndex, ref) => ({
        filterDropdown: ({setSelectedKeys, selectedKeys, confirm, clearFilters}) => (
            <div className={CN("p-2 rounded-lg bg-[#304456]")}>
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{marginBottom: 8, display: 'block'}}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined/>}
                        size="small"
                        style={{width: 90}}
                    >
                        Search
                    </Button>
                    <Button onClick={() => handleReset(clearFilters, confirm, dataIndex)} size="small"
                            style={{width: 90}}>
                        Reset
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({closeDropdown: false})
                        }}
                    >
                        Filter
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: () => <SearchOutlined ref={ref} className="hidden"/>,
        onFilterDropdownVisibleChange: visible => {
            if (visible) {
                setTimeout(() => searchInput.current.focus(), 100)
            }
        }
    })

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm()
        const result = [...searchedFields]
        const index = result.indexOf(dataIndex)
        if (index === -1) {
            result.push(dataIndex)
        }
        setSearchedFields(result)
        // setInputValue(selectedKeys[0])
        // setField(dataIndex.toLowerCase())
    }

    const handleReset = (clearFilters, confirm, dataIndex) => {
        clearFilters()
        confirm()
        const result = [...searchedFields]
        const index = result.indexOf(dataIndex)
        if (index !== -1) {
            result.splice(index, 1)
        }
        setSearchedFields(result)
        // setInputValue('')
    }

    const handlerOpenFilter = (event, ref) => {
        event.stopPropagation()
        if (ref.current) {
            ref.current.click()
        }
    }

    const columnPool = [
        {
            title: () => {
                const filtered = searchedFields.includes('Platform')
                return (
                    <div className="flex items-center">
                        <div>
                            Platform
                        </div>
                        <SearchOutlined
                            className={CN(
                                "ml-2",
                                {
                                    ["text-[#00FFA3]"]: filtered
                                }
                            )}
                            onClick={(event) => handlerOpenFilter(event, platformFilterRef)}
                        />
                    </div>
                )
            },
            dataIndex: 'platform',
            key: 'platform',
            width: '13%',
            search: true,
            ...getColumnSearchProps('Platform', platformFilterRef),
            render: (platform) => {
                const url = renderPlatformIconUrl(platform)
                return (
                    <div className={CN("flex items-center")}>
                        {
                            url && (
                                <PlatformIcon url={url} alt={platform}/>
                            )
                        }
                        <div>
                            {platform}
                        </div>
                    </div>
                )
            },
            sorter: (a, b) => a.platform - b.platform
        },
        {
            title: 'Type',
            dataIndex: 'liquidity_pool',
            key: 'liquidity_pool',
            width: '14%',
            render: (text, record) => {
                return (
                    <div className="flex flex-col">
                        <div>
                            Liquidity Pool
                        </div>
                        <div className="flex items-center">
                            <div className={CN("text-[#00FFA3] text-[12px] font-normal")}>
                                <Link href={renderSolscanUrl(record.liquidity_pool)}>
                                    <a target={"_blank"}>
                                        {brief_address(record.liquidity_pool)}
                                    </a>
                                </Link>
                            </div>
                            <CopyIcon handlerCopy={() => navigator.clipboard.writeText(record.liquidity_pool)}/>
                        </div>
                    </div>
                )
            }
        },
        {
            title: 'Liquidity',
            dataIndex: 'liquidity',
            key: 'liquidity',
            width: '16%',
            render: (text) => {
                return (
                    <div>
                        {(text !== undefined && text !== null) ? `$${text}` : "--"}
                    </div>
                )
            }
        },
        {
            title: 'Volume (24h)',
            dataIndex: 'volume',
            key: 'volume',
            width: '16%',
            render: (text) => {
                return (
                    <div>
                        {(text !== undefined && text !== null) ? `$${text}` : "--"}
                    </div>
                )
            }
        },
        {
            title: "LP Fees (24h)",
            dataIndex: 'lp_fee',
            key: 'lp_fee',
            width: '16%',
            render: (text) => {
                return (
                    <div>
                        {(text !== undefined && text !== null) ? `$${text}` : "--"}
                    </div>
                )
            }
        },
        {
            title: () => {
                const filtered = searchedFields.includes('Asset')
                return (
                    <div className="flex items-center">
                        <div>
                            Asset/s
                        </div>
                        <SearchOutlined
                            className={CN(
                                "ml-2",
                                {
                                    ["text-[#00FFA3]"]: filtered
                                }
                            )}
                            onClick={(event) => handlerOpenFilter(event, assetFilterRef)}
                        />
                    </div>
                )
            },
            dataIndex: 'asset',
            key: 'asset',
            width: '13%',
            ...getColumnSearchProps('Asset', assetFilterRef),
            render: (text, record) => {
                return (
                    <div className="text-[#00FFA3] uppercase">
                        {text}
                    </div>
                )
            }

        },
        {
            title: 'Return (APY)',
            dataIndex: 'apy',
            key: 'apy',
            width: '11%',
            align: "right",
            render: (text) => {
                return (
                    <div>
                        {text} %
                    </div>
                )
            },
            sorter: (a, b) => a.apy - b.apy
        }
    ]
    return (
        <div className="justify-between items-start w-full h-full wrapper ">
            <div className="px-2">
                <PageHeader title={"Opportunity"}/>
                <div className="flex justify-between mb-4 mt-6 lg:mb-8 lg:mt-12">
                    <div className="font-bold text-2xl text-white">
                        Opportunities
                    </div>
                    {
                        publicKey && (
                            <div className="">
                                <Button
                                    onClick={!isFilterByUserTokens ? findBaseOnUserToken : findAll}
                                    className={CN("w-48 rounded-2xl font-bold",
                                        "bg-[#00ffa329] text-[#00FFA3] border-transparent",
                                        "focus:bg-[#00ffa329] focus:text-[#00FFA3] focus:border-transparent",
                                        "hover:bg-[#00cc82] hover:text-white hover:border-transparent",
                                        "hover:focus:bg-[#00cc82] hover:focus:text-white hover:focus:border-transparent"
                                    )}
                                >
                                    {!isFilterByUserTokens ? "Find base on my tokens" : "Find All"}
                                </Button>
                            </div>
                        )
                    }
                </div>
                {/*<div className='my-4 text-base flex flex-row items-center justify-start '>*/}
                {/*  <span>Search</span>*/}
                {/*  <div className='border border-black rounded-lg h-9 flex flex-row items-stretch justify-start mx-2 overflow-hidden bg-white'>*/}
                {/*    <input type='text' value={inputValue} onChange={(e) => {setInputValue(e.target.value)}} className='outline-none mx-2' />*/}
                {/*    <div onClick={handleSearchPool} className='px-3 flex items-center bg-green-500 hover:bg-green-700 cursor-pointer text-white'>Search</div>*/}
                {/*  </div>*/}
                {/*  <span>{logInfo}</span>*/}
                {/*</div>*/}
                <div className="">
                    <Table
                        className={"opportunity-table rounded-2xl"}
                        rowClassName={CN("bg-[#232D36] text-white text-[14px] font-medium")}
                        pagination={{...pagination, position: ["bottomCenter"]}}
                        columns={columnPool}
                        dataSource={tableData}
                        onChange={handleTableChange}
                    />
                </div>
            </div>
        </div>
    )
}


export const getServerSideProps = async (context) => {
    connectToDatabase()
    const total = await Pool.count({})
    console.log(total)
    return {
        props: {
            totalPool: total
        } // will be passed to the page component as props
    }
}


export default Opportunity
