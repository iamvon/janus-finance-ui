/* eslint-disable @next/next/no-img-element */
import React, {useContext, useEffect, useState} from "react"
import PageHeader from "/src/components/common/PageHeader"
import {useRouter} from 'next/router'
import {DEFAULT_PAGE_SIZE} from "../../lib/constants/pagination"
import {Modal, Table, Tooltip} from "antd"
import {isEmpty} from "../../lib/services/util/object"
import {SORT_AND_FILTER_FIELD} from "../../lib/helpers/sort-and-filter-field/token"
import {SORT_BY_OPTIONS} from "../../lib/constants/sortBy/token"
import AppContext from "../../contexts/AppContext"
import _ from "lodash"
import {useWallet} from "@solana/wallet-adapter-react"
import {getExtendWishlistListApi, updateWishlistListApi} from "../../lib/services/api/wallet"
import {WISHLIST_ACTION} from "../../lib/constants/wallet"
import CN from "classnames"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faHeart, faLongArrowAltDown, faLongArrowAltUp, faTrashAlt} from "@fortawesome/free-solid-svg-icons"
import {formatPriceNumber} from "../../lib/helpers/number"
import Paths from "../../lib/routes/Paths"
import {getCoinGeckoChange} from "../../lib/services/api/coingecko"

const initialFilterValue = {}

Object.values(SORT_AND_FILTER_FIELD).forEach((key) => {
    initialFilterValue[key] = {
        min: null,
        max: null
    }
})

const Wishlist = (props) => {
    const {searchQuery} = useContext(AppContext)
    const [itemData, setItemData] = useState([])
    const [params, setParams] = useState({
        page: 1,
        size: 10
    })
    const [loading, setLoading] = useState(false)
    const [sortBy, _setSortBy] = useState({})
    const [total, setTotal] = useState(0)
    const [wishlist, setWishList] = useState([])

    const router = useRouter()
    const {publicKey} = useWallet()

    // useEffect(() => {
    //     const fetchWishlist = async () => {
    //         setLoading(true)
    //         const {data: responseData} = await getWishlistListApi({wallet_key: publicKey.toString()})
    //         const {wishlist} = {...responseData}
    //         // console.log('wishlist', wishlist)
    //         setWishList(wishlist)
    //         setLoading(false)
    //     }
    //
    //     if (publicKey) fetchWishlist().then()
    //     else setWishList([])
    // }, [publicKey])

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

    // useEffect(() => {
    //     const query = parseParamsToQuery(params, filter, sortBy, selectedCollections, searchQuery)
    //     const url = parseQueryToUrl(query)
    //     router.replace(url, undefined, {shallow: true}).then()
    //     // if (firstRender) {
    //     //     setFirstRender(false)
    //     // } else {
    //         fetchData().then()
    //     // }
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [params, sortBy, filter, selectedCollections, searchQuery])

    // const onChangeStartFilterPrice = (value) => {
    //     console.log('changed', value);
    // }

    const onChangeSortBy = e => {
        // console.log('radio checked', e.target.value);
        const value = e.target.value
        const selectedSortBy = SORT_BY_OPTIONS.find(i => i.value === value)
        setSortBy(selectedSortBy);
    };

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
        <div className="wishlist-page wrapper flex flex-col justify-start pb-12">
            <PageHeader title={"Wishlist"}/>
            <div className={'mt-8'}>
                <div className={'flex justify-between items-baseline'}>
                    <div className={CN("flex place-items-center mb-6")}>
                        <FontAwesomeIcon icon={faHeart} className={"text-2xl mr-4"} style={{color: "#e91e63"}}/>
                        <span className={CN("font-bold text-2xl")}>Wishlist</span>
                    </div>
                    <div className={'flex text-base'}>
                        Displaying {itemData.length} of {total} assets
                    </div>
                </div>
                <div>
                    <Table columns={columns}
                           dataSource={itemData}
                           loading={loading}
                           rowKey={record => record._id}
                           pagination={{
                               onChange: onChangePage,
                               total: total,
                               pageSize: params.size,
                               showSizeChanger: false
                           }}
                    />
                </div>
            </div>
        </div>
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

export default Wishlist
