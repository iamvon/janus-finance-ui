/* eslint-disable @next/next/no-img-element */
import React, {useContext, useEffect, useState} from "react"
import PageHeader from "/src/components/common/PageHeader"
import {useRouter} from 'next/router'
import {DEFAULT_PAGE_SIZE} from "../../lib/constants/pagination"
import {listTokenController} from "../../lib/controllers/token/listToken"
import SolanaTokenItem from "../../components/SolanaTokenItem"
import {Dropdown, Empty, Input, notification, Pagination, Radio, Checkbox} from "antd"
import CN from "classnames"
import {listTokenTagController} from "../../lib/controllers/token/listTokenTag"
import querystring from 'query-string'
import Paths from "../../lib/routes/Paths"
import {isEmpty, isNonValue} from "../../lib/services/util/object"
import {parseDataFromString} from "../../lib/helpers/sort-and-filter-field"
import {SORT_AND_FILTER_FIELD} from "../../lib/helpers/sort-and-filter-field/token"
import {SORT_BY_OPTIONS} from "../../lib/constants/sortBy/token"
import AppContext from "../../contexts/AppContext"
import {getTokenListApi} from "../../lib/services/api/token"
import _, {isArray} from "lodash"
import SkeletonAssetItem from "../../components/SkeletonTokenItem"
import TokenTag from "../../components/TokenTag"
import {useWallet} from "@solana/wallet-adapter-react"
import {getWishlistListApi, updateWishlistListApi} from "../../lib/services/api/wallet"
import {WISHLIST_ACTION} from "../../lib/constants/wallet"
import {checkMatchMediaQuery} from "../../utils"
import {renderTagName} from "../../lib/helpers/tag"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faSearch} from "@fortawesome/free-solid-svg-icons"

const initialFilterValue = {}

Object.values(SORT_AND_FILTER_FIELD).forEach((key) => {
    initialFilterValue[key] = {
        min: null,
        max: null
    }
})

const PC_HEIGHT = 600
const MB_HEIGHT = 350

const Token = (props) => {
    const {
        solanaTokens, tokenTags,
        defaultQuery,
        defaultTotal,
        defaultPage,
        defaultSize,
        // defaultFilter,
        defaultTags,
        defaultSort
    } = props
    const initTagOptions = [...tokenTags].map(i => {
        return {
            value: i.name,
            label: renderTagName(i.name)
        }
    })

    const [selectedTagList, setSelectedTagList] = useState(defaultTags)
    const [tagOptions, setTagOptions] = useState(initTagOptions)
    const [displayTagOptions, setDisplayTagOptions] = useState(initTagOptions)

    const {searchQuery, setSearchQuery} = useContext(AppContext)
    const [itemData, setItemData] = useState(solanaTokens)
    const [params, setParams] = useState({
        page: defaultPage,
        size: defaultSize
    })
    const [loading, setLoading] = useState(false)
    const [sortBy, _setSortBy] = useState(defaultSort)
    const [total, setTotal] = useState(defaultTotal)
    const [wishlist, setWishList] = useState([])
    const [inputFocus, setInputFocus] = useState(false)
    const [listFocus, setListFocus] = useState(false)
    const [listMouseEnter, setListMouseEnter] = useState(false)

    const router = useRouter()
    const {publicKey} = useWallet()

    const isMobile = checkMatchMediaQuery("only screen and (max-width: 1023.98px)")
    const [openTags, setOpenTags] = useState(!isMobile)

    useEffect(() => {
        // console.log('defaultQuery', defaultQuery)
        defaultQuery && setSearchQuery(defaultQuery)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        const fetchWishlist = async (_params) => {
            setLoading(true)
            const {data: responseData} = await getWishlistListApi({wallet_key: publicKey.toString()})
            const {wishlist} = {...responseData}
            // console.log('wishlist', wishlist)
            setWishList(wishlist)
            setLoading(false)
        }

        if (publicKey) fetchWishlist().then()
        else setWishList([])
    }, [publicKey])

    const setSortBy = (value) => {
        _setSortBy(value)
        setParams({
            ...params,
            page: 1
        })
    }

    useEffect(() => {
        // console.log('searchQuery1', searchQuery)
        const query = parseParamsToQuery(params, sortBy, selectedTagList, searchQuery)
        fetchData(query).then()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params, sortBy, searchQuery])

    const fetchData = async (_params) => {
        setLoading(true)
        // const _params = parseParamsToQuery(params, sortBy, selectedTags, searchQuery)
        const {data: responseData} = await getTokenListApi(_params)
        const {items, total: rTotal} = {...responseData}
        setItemData([...items])
        setTotal(rTotal)
        setLoading(false)
    }

    const onSearchTag = async (searchText) => {
        const filteredTags = initTagOptions.filter(op => op.value.toUpperCase().indexOf(searchText.toUpperCase()) !== -1)
        setTagOptions(filteredTags)
        const query = parseParamsToQuery(params, sortBy, selectedTagList, searchQuery)
        const url = parseQueryToUrl(query)
        router.replace(url, undefined, {shallow: true}).then()
        await fetchData(query)
    }

    const onSelectCustomTag = async (data) => {
        const newTagList = _.uniq([...selectedTagList, data])
        setSelectedTagList(newTagList)
        const query = parseParamsToQuery(params, sortBy, newTagList, searchQuery)
        const url = parseQueryToUrl(query)
        router.replace(url, undefined, {shallow: true}).then()
        await fetchData(query)
    }

    const onRemoveTag = async (tag) => {
        const newSelectedTagList = selectedTagList.filter(i => i !== tag)
        setSelectedTagList(newSelectedTagList)
        const query = parseParamsToQuery(params, sortBy, newSelectedTagList, searchQuery)
        const url = parseQueryToUrl(query)
        router.replace(url, undefined, {shallow: true}).then()
        await fetchData(query)
    }

    const handlerChangeTags = async (values) => {
        const result = tagOptions.filter(item => values.includes(item.value))
        const newTagList = result.map(i => i.value)
        setSelectedTagList(newTagList)
        const query = parseParamsToQuery(params, sortBy, newTagList, searchQuery)
        const url = parseQueryToUrl(query)
        router.replace(url, undefined, {shallow: true}).then()
        await fetchData(query)
    }

    // const onChangeStartFilterPrice = (value) => {
    //     console.log('changed', value);
    // }

    const onChangeSortBy = async (e) => {
        // console.log('radio checked', e.target.value);
        const value = e.target.value
        const selectedSortBy = SORT_BY_OPTIONS.find(i => i.value === value)
        setSortBy(selectedSortBy)
        const query = parseParamsToQuery(params, selectedSortBy, selectedTagList, searchQuery)
        const url = parseQueryToUrl(query)
        await router.replace(url, undefined, {shallow: true})
        // console.log('url', url);
        await fetchData(query)
    }

    const onApplyClick = async () => {
        const query = parseParamsToQuery(params, sortBy, selectedTagList, searchQuery)
        const url = parseQueryToUrl(query)
        router.replace(url, undefined, {shallow: true}).then()
        await fetchData(query)
    }

    const onChangePage = async (page, pageSize) => {
        const tmpParams = {...params, page, size: pageSize}
        setParams(tmpParams)
        const query = parseParamsToQuery(tmpParams, sortBy, selectedTagList, searchQuery)
        const url = parseQueryToUrl(query)
        router.replace(url, undefined, {shallow: true}).then()
        await fetchData(query)
    }

    // const itemPaginationRender = (page, type, originalElement) => {
    //     const selectTags = [...checkedTagList, selectedCustomTag]
    //     const query = parseParamsToQuery({...params, page: page}, sortBy, selectTags, searchQuery)
    //     const url = parseQueryToUrl(query)
    //     return (
    //         <Link href={url} shallow={true}>
    //             {originalElement}
    //         </Link>
    //     )
    // }

    const updateWishlist = async (token, isStared) => {
        if (isStared) {
            const newWishlist = wishlist.filter(address => address !== token.address)
            setWishList(newWishlist)
        } else {
            const newWishlist = _.uniq([...wishlist, token.address])
            setWishList(newWishlist)
        }
        const reqData = {
            walletKey: publicKey.toString(),
            action: isStared ? WISHLIST_ACTION.REMOVE : WISHLIST_ACTION.ADD,
            tokenAddress: token.address
        }
        await updateWishlistListApi(reqData)
    }

    const onStarClick = (token, isStared) => {
        if (!publicKey) {
            return notification.warn({
                message: 'Warning',
                description: "You have to connect your wallet to save this item in your wishlist"
            })
        }
        return updateWishlist(token, isStared)
    }

    const itemRender = () => {
        return itemData.length > 0 ? itemData.map((token) => {
            const isInWishlist = !!wishlist.includes(token.address)
            return (
                <SolanaTokenItem key={token._id} token={token} isStared={isInWishlist} onStarClick={onStarClick}/>
            )
        }) : (
            <div className="col-span-3 flex items-center justify-center w-full mt-5">
                <Empty className={'text-white'} description="No asset found with this filter"/>
            </div>
        )
    }

    const handlerSearchTag = (event) => {
        const value = event.target.value
        const str = renderTagName(value).toLowerCase()
        const result = tagOptions.filter(value => {
            const s = value.label.toLowerCase()
            return s.includes(str)
        })
        setDisplayTagOptions(result)
    }

    const overlay = () => {
        return (
            <div
                onMouseEnter={() => {
                    setListMouseEnter(true)
                }}
                onMouseLeave={() => {
                    setListMouseEnter(false)
                }}
                onClick={() => {
                    setListFocus(true)
                }}
                onBlur={() => {
                    setListFocus(false)
                }}
            >
                <Checkbox.Group
                    className="flex flex-col mt-4 space-y-4 overflow-y-auto"
                    defaultValue={selectedTagList}
                    onChange={handlerChangeTags}
                    value={selectedTagList}
                    style={{
                        height: MB_HEIGHT,
                        minHeight: MB_HEIGHT,
                        maxHeight: MB_HEIGHT
                    }}
                >
                    {
                        displayTagOptions.map((op) => {
                            return (
                                <Checkbox value={op.value} key={op.value}>
                                    {op.label}
                                </Checkbox>
                            )
                        })
                    }
                </Checkbox.Group>
            </div>
        )
    }

    return (
        <div className="tokens-page wrapper flex flex-col justify-start pb-12">
            <PageHeader title={"Assets"}/>
            <div className={'pt-6 lg:pt-16 flex flex-wrap'}>
                <div className={'w-full lg:w-1/4 pr-0 lg:pr-[50px] sticky tokens-sidebar mb-3'}>
                    <div className="font-semibold text-2xl mb-4 lg:hidden text-white">Assets</div>
                    <div>
                        <div>
                            <div className={'my-1'}>
                                <div className={"hidden lg:block"}>
                                    <Input
                                        prefix={<FontAwesomeIcon icon={faSearch} className={"mr-2 text-white"}/>}
                                        className="py-2 rounded-2xl bg-[#333639] flex"
                                        placeholder="Find tag here"
                                        onChange={handlerSearchTag}
                                    />
                                    <Checkbox.Group
                                        className="flex flex-col mt-4 space-y-4 overflow-y-auto"
                                        options={displayTagOptions}
                                        defaultValue={selectedTagList}
                                        onChange={handlerChangeTags}
                                        value={selectedTagList}
                                        style={{
                                            height: PC_HEIGHT,
                                            minHeight: PC_HEIGHT,
                                            maxHeight: PC_HEIGHT
                                        }}
                                    />
                                </div>
                                <Dropdown
                                    overlay={overlay()}
                                    className={"block lg:hidden"}
                                    overlayClassName={"tokens-page"}
                                    placement={"bottomCenter"}
                                    visible={inputFocus || listFocus || listMouseEnter}
                                >
                                    <Input
                                        placeholder="Find tag here"
                                        onChange={handlerSearchTag}
                                        prefix={<FontAwesomeIcon icon={faSearch} className={"mr-2 text-white"}/>}
                                        className="py-2 rounded-2xl bg-[#333639] flex"
                                        onClick={() => setInputFocus(true)}
                                        onBlur={() => setInputFocus(false)}
                                    />
                                </Dropdown>
                            </div>
                        </div>
                    </div>
                    {/*<div className={'mt-5 text-base'}>*/}
                    {/*    <div className={'text-base font-bold'}>WishlistTable price</div>*/}
                    {/*    <div className={'flex justify-between items-center mt-2'}>*/}
                    {/*        <div className={'flex'}>From</div>*/}
                    {/*        <div className={'flex'}>*/}
                    {/*            <InputNumber*/}
                    {/*                defaultValue={1000}*/}
                    {/*                formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}*/}
                    {/*                parser={value => value.replace(/\$\s?|(,*)/g, '')}*/}
                    {/*                onChange={onChangeStartFilterPrice}*/}
                    {/*            />*/}
                    {/*        </div>*/}
                    {/*    </div>*/}
                    {/*    <div className={'flex justify-between items-center mt-2'}>*/}
                    {/*        <div className={'flex'}>To</div>*/}
                    {/*        <div className={'flex'}>*/}
                    {/*            <InputNumber*/}
                    {/*                defaultValue={1000}*/}
                    {/*                formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}*/}
                    {/*                parser={value => value.replace(/\$\s?|(,*)/g, '')}*/}
                    {/*                onChange={onChangeStartFilterPrice}*/}
                    {/*            />*/}
                    {/*        </div>*/}
                    {/*    </div>*/}
                    {/*</div>*/}
                    {/*<div className={'mt-5 text-base'}>*/}
                    {/*    <div className={'text-base font-bold mb-2'}>Sort by</div>*/}
                    {/*    <div>*/}
                    {/*        <Radio.Group onChange={onChangeSortBy} value={sortBy.value}>*/}
                    {/*            {*/}
                    {/*                SORT_BY_OPTIONS.map((option, index) => {*/}
                    {/*                    return (*/}
                    {/*                        <div key={index} className={'my-2'}>*/}
                    {/*                            <Radio value={option.value}>{option.label}</Radio>*/}
                    {/*                        </div>*/}
                    {/*                    )*/}
                    {/*                })*/}
                    {/*            }*/}
                    {/*        </Radio.Group>*/}
                    {/*    </div>*/}
                    {/*</div>*/}
                    {/*<hr className={'border-t-2 my-5'}/>*/}
                    {/*<div className={'flex justify-end'}>*/}
                    {/*    <button type="button"*/}
                    {/*            onClick={onApplyClick}*/}
                    {/*            className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-3 py-1 text-center">*/}
                    {/*        Apply*/}
                    {/*    </button>*/}
                    {/*</div>*/}
                </div>


                <div className="w-full lg:w-3/4 tokens-content">
                    <h1 className="font-semibold text-2xl mb-4 hidden lg:block text-white">Assets</h1>

                    <div className="flex justify-between mb-6 hidden lg:block">
                        <div className={'flex text-base token-count'}>
                            Displaying {itemData.length} of {total} assets
                        </div>
                    </div>

                    <div className="flex flex-col lg:flex-col-reverse mb-6">
                        <div className="selected-filter flex justify-start flex-wrap mb-4 lg:mb-0">
                            {
                                selectedTagList.map((tag, index) => {
                                    return <TokenTag key={index} text={tag} onRemove={onRemoveTag}/>
                                })
                            }
                        </div>

                        <div className="sort-by flex justify-start flex-wrap lg:mb-8">
                            {/*<div className={'sort-by-title'}>Sort by</div>*/}
                            <div className="sort-by-radio">
                                <Radio.Group onChange={onChangeSortBy} value={sortBy.value}>
                                    {
                                        SORT_BY_OPTIONS.map((option, index) => {
                                            return (
                                                <div key={index} className={'option-item'}>
                                                    <Radio.Button value={option.value}
                                                                  className="font-semibold lg:font-normal">{option.label}</Radio.Button>
                                                </div>
                                            )
                                        })
                                    }
                                </Radio.Group>
                            </div>
                        </div>
                    </div>

                    <div className={'grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6'}>
                        {
                            loading ?
                                [...Array(params.size).keys()].map((it, index) => <SkeletonAssetItem
                                    key={index}/>) : itemRender()
                        }
                    </div>
                    <div className="flex items-center justify-center w-full token-pagination">
                        {
                            itemData.length > 0 && <Pagination
                                onChange={onChangePage}
                                pageSize={params.size}
                                total={total}
                                current={params.page}
                                showSizeChanger={false}
                                // itemRender={itemPaginationRender}
                            />
                        }
                    </div>
                </div>
                {/*<div className={'col-span-1'}>*/}

                {/*</div>*/}
            </div>
        </div>
    )
}

export const getServerSideProps = async (context) => {
    const query = context.query
    const params = parseQueryToParams(query)
    const _solanaTokens = listTokenController(context)
    const _solanaTokenTags = listTokenTagController({query: null})

    const [solanaTokens, solanaTokenTags] = await Promise.all([
        _solanaTokens,
        _solanaTokenTags
    ])

    if (!solanaTokens || !solanaTokenTags) {
        return {
            notFound: true
        }
    }
    return {
        props: {
            defaultQuery: query.q ? query.q : '',
            defaultTotal: solanaTokens.total,
            defaultPage: solanaTokens.page,
            defaultSize: solanaTokens.size,
            // defaultFilter: (JSON.parse(JSON.stringify(params.filter))),
            defaultSort: params.sortBy,
            defaultTags: params.tags ? isArray(params.tags) ? params.tags : [params.tags] : [],
            solanaTokens: JSON.parse(JSON.stringify(solanaTokens.items)),
            tokenTags: JSON.parse(JSON.stringify(solanaTokenTags.items))
        }
    }
}

const parseParamsToQuery = (params, sortBy, selectedTags, searchQuery) => {
    const _params = {
        ...params
    }

    _params.q = searchQuery

    // console.log("sortBy", sortBy)
    if (!isEmpty(sortBy)) {
        const entries = Object.entries(sortBy.query)
        const [key, value] = entries[0]
        _params.order_by = key
        _params.order_direction = value
    }

    // for (const entry of Object.entries(filter)) {
    //     const [key, value] = entry
    //     _params[`${key}_min`] = !isNonValue(value.min) ? value.min : null
    //     _params[`${key}_max`] = !isNonValue(value.max) ? value.max : null
    // }

    if (selectedTags.length > 0) {
        // console.log("selectedTags", selectedTags)
        _params.tags = _.uniq(selectedTags)
    }

    if (_params.size === DEFAULT_PAGE_SIZE.GRID) {
        delete _params.size
    }

    return _.pickBy(_params, _.identity)
}

const parseQueryToParams = (query) => {
    const result = {
        sortBy: {},
        tags: query.tags,
        filter: {...initialFilterValue}
    }
    if (query.order_by && query.order_direction) {
        const sortBy = SORT_BY_OPTIONS.find(i => {
            for (const [key, value] of Object.entries(i.query)) {
                try {
                    const direction = parseInt(query.order_direction)
                    if (key === query.order_by && value * direction > 0) {
                        return true
                    }
                } catch (e) {
                }
            }
            return false
        })
        result.sortBy = {...sortBy}
    }

    for (const key of Object.values(SORT_AND_FILTER_FIELD)) {
        const min = query[`${key}_min`]
        const max = query[`${key}_max`]
        if (!isNonValue(min)) {
            try {
                result.filter[key].min = parseDataFromString(key, min)
            } catch (e) {
            }
        }
        if (!isNonValue(max)) {
            try {
                result.filter[key].max = parseDataFromString(key, max)
            } catch (e) {
            }
        }
    }

    return result
}

// const initFilter = (defaultFilter) => {
//     const result = {...initialFilterValue}
//     for (const [key, value] of Object.entries(defaultFilter)) {
//         const min = value.min
//         const max = value.max
//         if (!isNonValue(min)) {
//             try {
//                 result[key].min = parseDataFromString(key, min)
//             } catch (e) {
//             }
//         }
//         if (!isNonValue(max)) {
//             try {
//                 result[key].max = parseDataFromString(key, max)
//             } catch (e) {
//             }
//         }
//     }
//     return result
// }

const parseQueryToUrl = (query) => {
    const _query = JSON.parse(JSON.stringify(query))
    const queryString = querystring.stringify(_query, {skipNull: true, skipEmptyString: true})
    return Paths.Tokens + "?" + queryString
}


export default Token
