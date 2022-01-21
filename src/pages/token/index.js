/* eslint-disable @next/next/no-img-element */
import React, {useContext, useEffect, useState} from "react"
import PageHeader from "/src/components/common/PageHeader"
import {useRouter} from 'next/router'
import {DEFAULT_PAGE_SIZE} from "../../lib/constants/pagination"
import {listTokenController} from "../../lib/controllers/token/listToken"
import SolanaTokenItem from "../../components/SolanaTokenItem"
import {AutoComplete, Checkbox, Pagination, Radio} from "antd"
import CN from "classnames"
import {faChartLine} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
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
import Link from "next/link"
import SkeletonAssetItem from "../../components/SkeletonTokenItem"

const initialFilterValue = {}

Object.values(SORT_AND_FILTER_FIELD).forEach((key) => {
    initialFilterValue[key] = {
        min: null,
        max: null
    }
})

const Token = (props) => {
    const {
        solanaTokens, tokenTags,
        // defaultQuery,
        defaultTotal,
        defaultPage,
        defaultSize,
        // defaultFilter,
        defaultTags,
        defaultSort,
    } = props
    const first5Tags = tokenTags.slice(0, 5)
    let restTags = [...tokenTags]
    restTags.splice(0, 5)
    const initTagOptions = restTags.map(i => {
        return {value: i.name}
    })
    const first5TagName = first5Tags.map(i => i.name)
    const defaultCustomTag = isArray(defaultTags) ? defaultTags.find(i => !first5TagName.includes(i)) : [defaultTags].find(i => !first5TagName.includes(i))

    const [checkedTagList, setCheckedTagList] = useState(defaultTags);
    const [tagOptions, setTagOptions] = useState(initTagOptions);
    const [selectedCustomTag, setSelectedCustomTag] = useState(defaultCustomTag ? defaultCustomTag : '');

    const {searchQuery} = useContext(AppContext)
    const [itemData, setItemData] = useState(solanaTokens)
    const [params, setParams] = useState({
        page: defaultPage,
        size: defaultSize
    })
    const [loading, setLoading] = useState(false)
    const [sortBy, _setSortBy] = useState(defaultSort)
    const [total, setTotal] = useState(defaultTotal)

    const router = useRouter()

    useEffect(() => {

    }, [])

    const setSortBy = (value) => {
        _setSortBy(value)
        setParams({
            ...params,
            page: 1
        })
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

    const fetchData = async (_params) => {
        setLoading(true)
        // const _params = parseParamsToQuery(params, sortBy, selectedTags, searchQuery)
        const {data: responseData} = await getTokenListApi(_params)
        const {items, total: rTotal} = {...responseData}
        setItemData([...items])
        setTotal(rTotal)
        setLoading(false)
    }

    const onChangeTagList = (checkedValues) => {
        // console.log('checked = ', checkedValues);
        setCheckedTagList(checkedValues);
    }

    const onSearchTag = (searchText) => {
        const filteredTags = initTagOptions.filter(op => op.value.toUpperCase().indexOf(searchText.toUpperCase()) !== -1)
        setTagOptions(filteredTags);
    };

    const onSelectCustomTag = (data) => {
        console.log('onSelect', data);
        setSelectedCustomTag(data);
    };

    const onChangeTagString = (data) => {
        setSelectedCustomTag(data);
    };

    // const onChangeStartFilterPrice = (value) => {
    //     console.log('changed', value);
    // }

    const onChangeSortBy = e => {
        // console.log('radio checked', e.target.value);
        const value = e.target.value
        const selectedSortBy = SORT_BY_OPTIONS.find(i => i.value === value)
        setSortBy(selectedSortBy);
    };

    const onApplyClick = async () => {
        const selectTags = [...checkedTagList, selectedCustomTag]
        // console.log("onApplyClick", selectTags)
        const query = parseParamsToQuery(params, sortBy, selectTags, searchQuery)
        const url = parseQueryToUrl(query)
        router.replace(url, undefined, {shallow: true}).then()
        await fetchData(query)
    }

    const onChangePage = async (page, pageSize) => {
        const tmpParams = {...params, page, size: pageSize}
        setParams(tmpParams)
        const selectTags = [...checkedTagList, selectedCustomTag]
        const query = parseParamsToQuery(tmpParams, sortBy, selectTags, searchQuery)
        const url = parseQueryToUrl(query)
        router.replace(url, undefined, {shallow: true}).then()
        await fetchData(query)
    }

    const itemPaginationRender = (page, type, originalElement) => {
        const selectTags = [...checkedTagList, selectedCustomTag]
        const query = parseParamsToQuery({...params, page: page}, sortBy, selectTags, searchQuery)
        const url = parseQueryToUrl(query)
        return (
            <Link href={url} shallow={true}>
                {originalElement}
            </Link>
        )
    }

    return (
        <div className="wrapper flex flex-col justify-start pb-12">
            <PageHeader title={"Assets"}/>
            <div className={'pt-12 grid grid-cols-2 gap-4 md:grid-cols-4 xl:grid-cols-6 xl:gap-6'}>
                <div className={'col-span-1 sticky'}>
                    <div>
                        <div className={'text-base font-bold mb-2'}>Tags</div>
                        <div>
                            <Checkbox.Group value={checkedTagList} onChange={onChangeTagList}>
                                {
                                    first5Tags.map((tag, index) => {
                                        return (
                                            <div key={index} className={'my-1'}>
                                                <Checkbox value={tag.name}>{tag.name}</Checkbox>
                                            </div>
                                        )
                                    })
                                }
                            </Checkbox.Group>
                            <div className={'my-1'}>
                                <Checkbox checked={!!selectedCustomTag}
                                          disabled>
                                    <AutoComplete
                                        value={selectedCustomTag}
                                        options={tagOptions}
                                        style={{width: 150}}
                                        onSelect={onSelectCustomTag}
                                        onSearch={onSearchTag}
                                        onChange={onChangeTagString}
                                        placeholder="Find tag here"
                                    />
                                </Checkbox>
                            </div>
                        </div>
                    </div>
                    {/*<div className={'mt-5 text-base'}>*/}
                    {/*    <div className={'text-base font-bold'}>Token price</div>*/}
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
                    <div className={'mt-5 text-base'}>
                        <div className={'text-base font-bold mb-2'}>Sort by</div>
                        <div>
                            <Radio.Group onChange={onChangeSortBy} value={sortBy.value}>
                                {
                                    SORT_BY_OPTIONS.map((option, index) => {
                                        return (
                                            <div key={index} className={'my-2'}>
                                                <Radio value={option.value}>{option.label}</Radio>
                                            </div>
                                        )
                                    })
                                }
                            </Radio.Group>
                        </div>
                    </div>
                    <hr className={'border-t-2 my-5'}/>
                    <div className={'flex justify-end'}>
                        <button type="button"
                                onClick={onApplyClick}
                                className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-3 py-1 text-center">
                            Apply
                        </button>
                    </div>
                </div>
                <div className={'col-span-5'}>
                    <div className={'flex justify-between'}>
                        <div className={CN("flex place-items-center mb-6")}>
                            <FontAwesomeIcon icon={faChartLine} className={"text-2xl mr-4"}/>
                            <span className={CN("font-bold text-2xl")}>Assets</span>
                        </div>
                    </div>
                    <div className={'grid grid-cols-2 gap-4 md:grid-cols-3'}>
                        {loading ?
                            [...Array(params.size).keys()].map((it, index) => <SkeletonAssetItem
                                key={index}/>) : itemData.map((token) => {
                                return (
                                    <SolanaTokenItem key={token._id} token={token}/>
                                )
                            })
                        }
                    </div>
                    <div className="flex items-center justify-center w-full mt-5">
                        <Pagination
                            onChange={onChangePage}
                            pageSize={params.size}
                            total={total}
                            current={params.page}
                            showSizeChanger={false}
                            // itemRender={itemPaginationRender}
                        />
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
            notFound: true,
        }
    }
    return {
        props: {
            defaultQuery: query.q ? query.q : '',
            defaultTotal: solanaTokens.total,
            defaultPage: solanaTokens.page,
            defaultSize: solanaTokens.size,
            defaultFilter: (JSON.parse(JSON.stringify(params.filter))),
            defaultSort: params.sortBy,
            defaultTags: params.tags ? params.tags : [],
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
        _params.tags = selectedTags
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

const initFilter = (defaultFilter) => {
    const result = {...initialFilterValue}
    for (const [key, value] of Object.entries(defaultFilter)) {
        const min = value.min
        const max = value.max
        if (!isNonValue(min)) {
            try {
                result[key].min = parseDataFromString(key, min)
            } catch (e) {
            }
        }
        if (!isNonValue(max)) {
            try {
                result[key].max = parseDataFromString(key, max)
            } catch (e) {
            }
        }
    }
    return result
}

const parseQueryToUrl = (query) => {
    const _query = JSON.parse(JSON.stringify(query))
    const queryString = querystring.stringify(_query, {skipNull: true, skipEmptyString: true})
    return Paths.Token + "?" + queryString
}


export default Token
