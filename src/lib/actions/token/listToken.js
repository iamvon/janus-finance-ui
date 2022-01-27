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
    vQuery = {...vQuery, "extensions.coingeckoId": {$exists: true}}

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

export const listToken = async ({page, size, query, orderBy}) => {
    await connectToDatabase()
    const SolanaToken = getModel('SolanaToken')

    const skip = (page - 1) * size

    const vQuery = await _getQuery(query)

    const vSortBy = {}

    for (const [key, value] of Object.entries(orderBy)) {
        const vKey = convertFieldName(key)
        vSortBy[vKey] = value
        if (vKey !== SEARCH_SORT_KEY) vQuery[vKey] = {$ne: null}
    }

    // console.log(rQuery)

    // console.log('final sort by', vSortBy)

    const _getTotal = SolanaToken
        .countDocuments(vQuery)
        .lean()

    const _getItems = SolanaToken
        .find(vQuery)
        .sort(vSortBy)
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