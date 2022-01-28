import {connectToDatabase} from "../../connections/mongodb"
import {getModel} from "../../models"
import Promise from "bluebird"

const _getQuery = async (query) => {
    console.log(query)
    let vQuery = {}
    const fieldArr = Object.keys(query).filter(k => query[k] !== null)

    if(fieldArr.length === 0) {}
    else if(fieldArr.length === 1){
        const regexString = '(' + query[fieldArr[0]].join('|') + ')'
        vQuery[fieldArr[0]] = { "$regex": '^' + regexString,  "$options": "i"}
    } 
    else {
        const arr = fieldArr.map(k => {
            const newObj = {}
            const regexString = '(' + query[k].join('|') + ')'
            newObj[k] = { "$regex": '^' + regexString,  "$options": "i"}
            return newObj
        })
        vQuery = {$and: arr}
    }

    console.log(vQuery)

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