import Promise from 'bluebird'
import {
    convertFieldName,
    PARSE_DATE_FIELDS,
    PARSE_FLOAT_FIELDS,
    SORT_AND_FILTER_FIELD
} from "/src/lib/helpers/sort-and-filter-field/token"
import {connectToDatabase} from "/src/lib/connections/mongodb"
import {getModel} from "../../models"

const SEARCH_SORT_KEY = 'score'

const _getQuery = async (query) => {
    let vQuery = query.q ? {$text: {$search: query.q}} : {}

    for (const key of Object.values(SORT_AND_FILTER_FIELD)) {
        if (query[key].min === undefined && query[key].max === undefined) {
            continue
        }
        const vKey = convertFieldName(key)
        vQuery[vKey] = {$ne: null}
        if (query[key].min !== undefined) {
            let value = query[key].min
            if (PARSE_FLOAT_FIELDS.includes(key)) {
                value = parseFloat(value)
            } else if (PARSE_DATE_FIELDS.includes(key)) {
                value = new Date(value)
            }
            vQuery[vKey].$gte = value
        }
        if (query[key].max !== undefined) {
            let value = query[key].max
            if (PARSE_FLOAT_FIELDS.includes(key)) {
                value = parseFloat(value)
            } else if (PARSE_DATE_FIELDS.includes(key)) {
                value = new Date(value)
            }
            vQuery[vKey].$lte = value
        }
    }
    const tags = query.tags ? query.tags : null
    if (tags) {
        vQuery.$or = tags.map(tag => {
            return {
                tag: tag
            }
        })
    }
    // console.log(vQuery)
    return vQuery

}

export const listToken = async ({page, size, query, orderBy, isTopTrending, isTopSell, isTopBuy}) => {
    await connectToDatabase()
    const SolanaToken = getModel('SolanaToken')

    const skip = (page - 1) * size

    const vQuery = await _getQuery(query)

    const vSortBy = {}

    for (const [key, value] of Object.entries(orderBy)) {
        const vKey = convertFieldName(key)
        if (vKey === 'topTrendingRank') vSortBy['isTopTrending'] = -1
        else if (vKey === 'topSellRank') vSortBy['isTopSell'] = -1
        else if (vKey === 'topBuyRank') vSortBy['isTopBuy'] = -1
        else if (vKey !== SEARCH_SORT_KEY) vQuery[vKey] = {$ne: null}
        vSortBy[vKey] = value
    }

    // console.log(rQuery)

    // console.log('final sort by', vSortBy)
    const rQuery = {...vQuery}
    const rSortBy = {...vSortBy}

    if (isTopTrending) {
        rQuery.isTopTrending = true
        rSortBy.topTrendingRank = 1
    } else if (isTopSell) {
        rQuery.isTopSell = true
        rSortBy.topSellRank = 1
    } else if (isTopBuy) {
        rQuery.isTopBuy = true
        rSortBy.topBuyRank = 1
    } else {
        // rQuery["extensions.coingeckoId"] = {$exists: true}
    }

    // console.log("rQuery", rQuery)
    // console.log("rSortby", rSortBy)

    const _getTotal = SolanaToken
        .countDocuments(rQuery)
        .lean()

    const _getItems = SolanaToken
        .find(rQuery)
        .select({
            lastChangePercentUpdated: 0,
            isTopSell: 0,
            topSellRank: 0,
            isTopBuy: 0,
            topBuyRank: 0,
            isTopTrending: 0,
            topTrendingRank: 0
        })
        .sort(rSortBy)
        .skip(skip)
        .limit(size)
        .lean()

    const [total, items] = await Promise.all([
        _getTotal,
        _getItems,
    ])

    const totalPage = Math.ceil(total / size)

    // console.log(vItems)

    return {
        page,
        size,
        total,
        totalPage,
        items: items,
    }
}