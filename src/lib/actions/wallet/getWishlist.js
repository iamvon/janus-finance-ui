import {connectToDatabase} from "/src/lib/connections/mongodb"
import {getModel} from "../../models"
import {
    convertFieldName,
    PARSE_DATE_FIELDS,
    PARSE_FLOAT_FIELDS,
    SORT_AND_FILTER_FIELD
} from "../../helpers/sort-and-filter-field/token"
import Promise from "bluebird"


const getOrCreateWalletWishlist = (walletKey) => {
    const WalletWishlist = getModel('WalletWishlist')
    return WalletWishlist.findOne({wallet_key: walletKey})
        .then(wishlist => {
            if (!wishlist) {
                return WalletWishlist.create({wallet_key: walletKey, wishlist: []})
            }
            return wishlist
        })
}

const _getQuery = async (query, wishlist) => {
    let vQuery = query.q ? {$text: {$search: query.q}} : {}
    vQuery = {
        ...vQuery,
        "extensions.coingeckoId": {$exists: true},
        address: {$in: wishlist}
    }

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
    // console.log(vQuery)
    return vQuery
}


export const getWishlist = async ({walletKey}) => {
    await connectToDatabase()
    if (walletKey) return await getOrCreateWalletWishlist(walletKey)
    return Promise.reject(new Error('Error: wallet_key is required'))
}


export const getExtendedWishlist = async ({page, size, query, orderBy, walletKey}) => {
    await connectToDatabase()
    const SolanaToken = getModel('SolanaToken')

    if (walletKey) {
        const walletWishlist = await getOrCreateWalletWishlist(walletKey)
        const {wishlist} = walletWishlist

        const skip = (page - 1) * size

        const vQuery = await _getQuery(query, wishlist)

        const vSortBy = {}

        for (const [key, value] of Object.entries(orderBy)) {
            const vKey = convertFieldName(key)
            vSortBy[vKey] = value
        }

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
    return Promise.reject(new Error('Error: wallet_key is required'))
}