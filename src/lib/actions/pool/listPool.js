import {connectToDatabase} from "../../connections/mongodb"
import {getModel} from "../../models"
import Promise from "bluebird"

const _getQuery = async (query) => {
    console.log(query)
    let vQuery = {}

    const platformRegex = query["platform"] ? {
        platform: { "$regex": query.platform[0],  "$options": "i"}
    } : {}

    const assetString = query["asset"] ? "(" + query["asset"].join("|") + ")" : ""

    const userString = query.userToken ? "(" + query.userToken.join("|") + ")" : ""

    const assetArr = [assetString, userString]
    
    const assetRegex = {
        asset: { "$regex": assetArr.join('.*') + "|" + assetArr.reverse().join('.*'),  "$options": "i"}
    }

    vQuery = {$and: [platformRegex, assetRegex]}

    console.log(JSON.stringify(vQuery))

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