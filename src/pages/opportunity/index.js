/* eslint-disable @next/next/no-img-element */
import React, {useEffect, useState} from "react"
import PageHeader from "/src/components/common/PageHeader"
import {useRouter} from 'next/router'
import {connectToDatabase} from "../../lib/connections/mongodb"
import Pool from '../../lib/models/pool.model'
import {getPoolListApi} from "../../lib/services/api/pool"
import {Table, Tag, Input, Select} from 'antd'
import axios from 'axios'
import CN from "classnames"
import {brief_address} from "../../lib/helpers/address"
import Link from "next/link"
import CopyIcon from "../../components/common/CopyIcon"
import {faCopy, faInfo, faInfoCircle, faSearch} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {renderSolscanUrl} from "../../lib/helpers/solscan"

const rowClassName = 'hover:bg-[#232D36]'

const Opportunity = ({totalPool}) => {
    const columnPool = [
        {
            title: 'Platform',
            dataIndex: 'platform',
            key: 'platform',
            width: '13%',
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
            title: '',
            dataIndex: 'liquidity',
            key: 'liquidity',
            width: '16%',
            render: (text) => {
                return (
                    <div>
                        <div>
                            {(text !== undefined && text !== null) ? `$${text}` : "--"}
                        </div>
                        <div className="flex items-center opacity-64">
                            <div className={CN("text-[12px] font-normal")}>
                                Liquidity
                            </div>
                            {/*<FontAwesomeIcon icon={faInfoCircle} color={"#FFFFFF"}*/}
                            {/*                 className={CN("ml-2 text-gray-400")}/>*/}
                        </div>
                    </div>
                )
            }
        },
        {
            title: '',
            dataIndex: 'volume',
            key: 'volume',
            width: '16%',
            render: (text) => {
                return (
                    <div>
                        <div>
                            {(text !== undefined && text !== null) ? `$${text}` : "--"}
                        </div>
                        <div className="flex items-center opacity-64">
                            <div className={CN("text-[12px] font-normal")}>
                                Volume (24h)
                            </div>
                        </div>
                    </div>
                )
            }
        },
        {
            title: "",
            dataIndex: 'lp_fee',
            key: 'lp_fee',
            width: '16%',
            render: (text) => {
                return (
                    <div>
                        <div>
                            {(text !== undefined && text !== null) ? `$${text}` : "--"}
                        </div>
                        <div className="flex items-center opacity-64">
                            <div className={CN("text-[12px] font-normal")}>
                                LP Fees (24h)
                            </div>
                        </div>
                    </div>
                )
            }
        },
        {
            title: (
                <div className="flex items-center">
                    <div className="mr-2">
                        Asset/s
                    </div>
                    <FontAwesomeIcon icon={faSearch} size={"sm"}/>
                </div>
            ),
            dataIndex: 'asset',
            key: 'asset',
            width: '13%',
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

    const [tableData, setTableData] = useState([])
    const [inputValue, setInputValue] = useState('')
    const [pagination, setPagination] = useState({current: 1, pageSize: 10, total: totalPool})
    const [logInfo, setLogInfo] = useState("")

    const handleFetchPool = async (newPagination, sorter, curText) => {
        const size = newPagination.pageSize
        const page = newPagination.current
        let orderBy = ''
        let orderDirection = 1

        if (sorter.order) {
            orderBy = sorter.field
            orderDirection = sorter.order === 'descend' ? -1 : 1
        }

        const {data: res} = await axios.post('/api/pool', {
            page,
            size,
            order_by: orderBy,
            order_direction: orderDirection,
            q: curText
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
        handleFetchPool(pagination, {}, "")
    }, [])

    const handleTableChange = (newPagination, filters, sorter) => {
        // console.log(newPagination, filters, sorter)
        setPagination({...pagination, current: newPagination.current, pageSize: newPagination.pageSize})
        handleFetchPool(newPagination, sorter, inputValue)
    }

    const handleSearchPool = () => {
        handleFetchPool({...pagination, current: 1, pageSize: 10}, {}, inputValue)
    }

    return (
        <div className="justify-between items-start w-full h-full wrapper ">
            <div className="px-2">
                <PageHeader title={"Opportunity"}/>
                <div className="font-bold text-2xl text-white py-16">
                    Opportunities
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
                        pagination={pagination}
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
