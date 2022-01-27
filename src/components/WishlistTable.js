/* eslint-disable @next/next/no-img-element */
import React, {useContext, useEffect, useState} from "react"
import {DEFAULT_PAGE_SIZE} from "../lib/constants/pagination"
import {Modal, Table, Tooltip} from "antd"
import {isEmpty} from "../lib/services/util/object"
import {SORT_BY_OPTIONS} from "../lib/constants/sortBy/token"
import AppContext from "../contexts/AppContext"
import _ from "lodash"
import {useWallet} from "@solana/wallet-adapter-react"
import {getExtendWishlistListApi, updateWishlistListApi} from "../lib/services/api/wallet"
import {WISHLIST_ACTION} from "../lib/constants/wallet"
import CN from "classnames"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faLongArrowAltDown, faLongArrowAltUp, faTrashAlt} from "@fortawesome/free-solid-svg-icons"
import {formatPriceNumber} from "../lib/helpers/number"
import Paths from "../lib/routes/Paths"
import {getCoinGeckoChange} from "../lib/services/api/coingecko"

const WishlistTable = ({tableSize, pagination = false}) => {
    const {searchQuery} = useContext(AppContext)
    const [itemData, setItemData] = useState([])
    const [params, setParams] = useState({
        page: 1,
        size: tableSize || 10
    })
    const [loading, setLoading] = useState(false)
    const [sortBy, _setSortBy] = useState({})
    const [total, setTotal] = useState(0)
    const {publicKey} = useWallet()

    useEffect(() => {
        const query = parseParamsToQuery(params, sortBy, publicKey, searchQuery)
        publicKey && fetchWishlistTokens(query).then()
    }, [params, publicKey, searchQuery, sortBy])

    const setSortBy = (value) => {
        _setSortBy(value)
        setParams({
            ...params,
            page: 1
        })
    }

    const fetchWishlistTokens = async (params) => {
        setLoading(true)
        const {data: responseData} = await getExtendWishlistListApi(params)
        const {items: rItems, total: rTotal} = {...responseData}
        const items = await Promise.all(rItems.map(async item => {
            const coinId = item.extensions.coingeckoId
            return {
                ...item,
                't24h': await getCoinGeckoChange(coinId, 1),
                't7d': await getCoinGeckoChange(coinId, 7),
                't1m': await getCoinGeckoChange(coinId, 30),
            }
        }))
        // console.log('items', items)
        setItemData(items)
        setTotal(rTotal)
        setLoading(false)
    }

    const onChangePage = async (page, pageSize) => {
        const tmpParams = {...params, page, size: pageSize}
        setParams(tmpParams)
        const query = parseParamsToQuery(tmpParams, sortBy, publicKey, searchQuery)
        await fetchWishlistTokens(query)
    }

    const updateWishlist = async (token) => {
        const reqData = {
            walletKey: publicKey.toString(),
            action: WISHLIST_ACTION.REMOVE,
            tokenAddress: token.address
        }
        await updateWishlistListApi(reqData)
        const query = parseParamsToQuery(params, sortBy, publicKey, searchQuery)
        await fetchWishlistTokens(query)
    }

    const onRemoveClick = (token) => {
        return Modal.confirm({
            title: `Remove token ${token.name} from your wishlist ?`,
            // content: 'You can add this token back to the wishlist at any time',
            onOk: async () => {
                await updateWishlist(token)
            },
            centered: true,
            type: 'confirm',
            okText: 'Ok, remove',
            onCancel: () => {
            },
        })
    }

    const onTableChange = (newPagination, filters, sorter) => {
        // console.log(newPagination, filters, sorter)
        const sortByField = SORT_BY_OPTIONS.find(i => i.field === sorter.field && i.direction === sorter.order)
        // console.log('sortByField', sortByField)
        !!sortByField && setSortBy(sortByField)
    }


    const renderChangePercent = (change) => {
        const absChange = Math.abs(change).toFixed(2)
        if (change > 0) {
            return (
                <div className={''} style={{color: '#16c784'}}>
                    <FontAwesomeIcon icon={faLongArrowAltUp} className={'text-base mr-2'}/>
                    {absChange} %
                </div>
            )
        } else if (change < 0) {
            return (
                <div className={''} style={{color: '#ea3943'}}>
                    <FontAwesomeIcon icon={faLongArrowAltDown} className={'text-base mr-2'}/>
                    {absChange} %
                </div>
            )
        } else return (
            <div>
                {change} %
            </div>
        )
    }

    const columns = [
        {
            title: 'Token',
            dataIndex: 'name',
            width: '30%',
            render: (name, item) => {
                const tagsString = item.tag.length > 0 ? '#' + item.tag.join(", #") : ''
                return (
                    <a className={'flex justify-start items-center'} href={Paths.TokenDetail(item.address)}>
                        <div className="flex token-logo mr-5">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={item.logoURI}
                                 alt={item.extensions.description} loading="lazy"/>
                        </div>
                        <div className="token-content mt-1">
                            <Tooltip title={item.address}>
                                <h2 className="token-name text-base font-bold text-green-800">{name}</h2>
                            </Tooltip>
                            <div className="token-tags">
                                {tagsString}
                            </div>
                        </div>
                    </a>
                )
            }
        },
        {
            title: 'Price',
            dataIndex: 'price',
            align: 'right',
            render: (value, item) => {
                return (
                    <div>
                        <span>${formatPriceNumber(value)}</span>
                    </div>
                )
            },
            sorter: true
        },
        {
            title: '24H %',
            dataIndex: 't24h',
            align: 'right',
            render: (value, item) => renderChangePercent(value)
        },
        {
            title: '7D %',
            dataIndex: 't7d',
            align: 'right',
            render: (value, item) => renderChangePercent(value)
        },
        {
            title: '1M %',
            dataIndex: 't1m',
            align: 'right',
            render: (value, item) => renderChangePercent(value)
        },
        {
            title: '',
            align: 'center',
            render: (_, item) => {
                return (
                    <div className={'actions'}>
                        <div className={'cursor-pointer'} onClick={() => onRemoveClick(item)}>
                            <FontAwesomeIcon icon={faTrashAlt} className={CN("text-base text-red-700")}/>
                        </div>
                    </div>
                )
            }
        },
    ];

    return (
        <Table columns={columns}
               dataSource={itemData}
               loading={loading}
               rowKey={record => record._id}
               onChange={onTableChange}
               pagination={pagination && {
                   onChange: onChangePage,
                   total: total,
                   pageSize: params.size,
                   showSizeChanger: false
               }}
        />
    )
}


// export const getStaticProps = async (context) => {
//     return {
//         props: {}
//     }
// }

const parseParamsToQuery = (params, sortBy, walletKey, searchQuery) => {
    const _params = {
        ...params
    }

    _params.q = searchQuery
    if (walletKey) _params.wallet_key = walletKey.toString()

    // console.log("sortBy", sortBy)
    if (!isEmpty(sortBy)) {
        const entries = Object.entries(sortBy.query)
        const [key, value] = entries[0]
        _params.order_by = key
        _params.order_direction = value
    }

    if (_params.size === DEFAULT_PAGE_SIZE.GRID) {
        delete _params.size
    }

    return _.pickBy(_params, _.identity)
}

export default WishlistTable
