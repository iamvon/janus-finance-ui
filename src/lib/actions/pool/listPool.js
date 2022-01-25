import {connectToDatabase} from "../../connections/mongodb"
import {getModel} from "../../models"
import Promise from "bluebird"

const _getQuery = async (query) => {
    let vQuery = query.q ? {asset: { "$regex": '^' + query.q,  "$options": "i"}} : {}

    // for (const key of Object.values(SORT_AND_FILTER_FIELD)) {
    //     if (query[key].min === undefined && query[key].max === undefined) {
    //         continue
    //     }
    //     const vKey = convertFieldName(key)
    //     vQuery[vKey] = {$ne: null}
    //     if (query[key].min !== undefined) {
    //         let value = query[key].min
    //         if (PARSE_FLOAT_FIELDS.includes(key)) {
    //             value = parseFloat(value)
    //         } else if (PARSE_DATE_FIELDS.includes(key)) {
    //             value = new Date(value)
    //         }
    //         vQuery[vKey].$gte = value
    //     }
    //     if (query[key].max !== undefined) {
    //         let value = query[key].max
    //         if (PARSE_FLOAT_FIELDS.includes(key)) {
    //             value = parseFloat(value)
    //         } else if (PARSE_DATE_FIELDS.includes(key)) {
    //             value = new Date(value)
    //         }
    //         vQuery[vKey].$lte = value
    //     }
    // }

    return vQuery

}

export const listPool = async ({page, size, query, orderBy}) => {
    await connectToDatabase()
    const Pool = getModel('pool.model')

    const skip = (page - 1) * size

    const vQuery = await _getQuery(query)

    const vSortBy = {}

    for (const [key, value] of Object.entries(orderBy)) {
        const vKey = key
        vSortBy[vKey] = value
        // if (vKey !== SEARCH_SORT_KEY) vQuery[vKey] = {$ne: null}
    }

    // console.log(rQuery)

    // console.log('final sort by', vSortBy)

    const _getTotal = Pool
        .countDocuments(vQuery)
        .lean()

    const _getItems = Pool
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