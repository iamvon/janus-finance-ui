/* eslint-disable @next/next/no-img-element */
import React, {useEffect, useState} from "react"
import PageHeader from "/src/components/common/PageHeader"
import {useRouter} from 'next/router'
import { connectToDatabase } from "../../lib/connections/mongodb";
import Pool from '../../lib/models/pool.model'
import {getPoolListApi} from "../../lib/services/api/pool"
import { Table, Tag, Input, Select  } from 'antd';
import axios from 'axios'
import {useSolWalletScan} from '../../hook/useSolWalletScan'

const Opportunity = ({totalPool}) => {
    const columnPool = [
        {
          title: '#',
          dataIndex: 'key',
          key: 'key',
          width: '10%',
          sorter: (a, b) => a.key - b.key,
          render: (text, record, index) => text + 1,
        },
        {
          title: 'Platform',
          dataIndex: 'platform',
          key: 'platform',
          width: '20%',
          sorter: (a, b) => a.platform - b.platform,
        },
        {
          title: 'Type',
          dataIndex: 'liquidity_pool',
          key: 'liquidity_pool',
          width: '20%',
          render: (text, record) => {
            
            return (
                <div className="flex flex-col">
                    <div>
                        Liquidity Pool
                    </div>
                    <div className="truncate">
                        {record.liquidity_pool}
                    </div>
                </div>
            )
          }
        },
        {
          title: 'Liquidity',
          dataIndex: 'liquidity',
          key: 'liquidity',
          width: '20%',
          sorter: (a, b) => a.liquidity - b.liquidity,
        },
        {
          title: 'Volume',
          dataIndex: 'volume',
          key: 'volume',
          width: '20%',
          sorter: (a, b) => a.volume - b.volume,
        },
        {
          title: 'LP Fee',
          dataIndex: 'lp_fee',
          key: 'lp_fee',
          width: '20%',
          sorter: (a, b) => a.lp_fee - b.lp_fee,
        },
        {
          title: 'Asset',
          dataIndex: 'asset',
          key: 'asset',
          width: '20%',
          sorter: (a, b) => a.asset - b.asset,
        },
        {
          title: 'APY',
          dataIndex: 'apy',
          key: 'apy',
          width: '20%',
          sorter: (a, b) => a.apy - b.apy,
        }
      ];  
    
      const [tableData, setTableData] = useState([])
      const [inputValue, setInputValue] = useState('')
      const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: totalPool })
      const [logInfo, setLogInfo] = useState("")
      const {tokens, loading, error} = useSolWalletScan()

      console.log(tokens, loading, error)
    
      const handleFetchPool = async (newPagination, sorter, curText) => {
        const size = newPagination.pageSize
        const page = newPagination.current
        let orderBy = ''
        let orderDirection = 1

        if(sorter.order) {
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
            key: (page - 1)*size + index,
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

      const filterByUserToken = () => {
        const tokensInPortfolio = [];
        tokens.forEach(token => {
          if (token?.token?.symbol) {
            tokensInPortfolio.push(token.token.symbol)
          }
        })
        console.log(tokensInPortfolio)
      }
    
      return (
        <div className='flex flex-row justify-between items-start bg-gray-100 w-full h-full '>
          <div className='flex flex-col px-2'>
            <PageHeader title={"Opportunity"}/>
            <div className='my-4 text-base flex flex-row items-center justify-end'>
              <button onClick={filterByUserToken}>Find base on my tokens</button>
            </div>
            <div className='my-4 text-base flex flex-row items-center justify-start '>
              <span>Search</span>
              <div className='border border-black rounded-lg h-9 flex flex-row items-stretch justify-start mx-2 overflow-hidden bg-white'>
                <input type='text' value={inputValue} onChange={(e) => {setInputValue(e.target.value)}} className='outline-none mx-2' />
                <div onClick={handleSearchPool} className='px-3 flex items-center bg-green-500 hover:bg-green-700 cursor-pointer text-white'>Search</div>
              </div>
              <span>{logInfo}</span>
            </div>
            <div className=''>
              <Table
                  pagination={pagination}
                  columns={columnPool}
                  dataSource={tableData}
                  onChange={handleTableChange}
                  scroll={{y: '85vh'}}
              />
            </div>
          </div>
        </div>
      );
}


export const getServerSideProps = async (context) => {
    connectToDatabase()
    const total =  await Pool.count({})
    console.log(total)
    return {
      props: {
          totalPool: total
      }, // will be passed to the page component as props
    }
}


export default Opportunity
