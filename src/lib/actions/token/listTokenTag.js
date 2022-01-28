import {connectToDatabase} from "../../connections/mongodb"
import {getModel} from "../../models"
import Promise from "bluebird"

export const listTokenTag = async ({query}) => {
    await connectToDatabase()
    const SolanaTokenTag = getModel('SolanaTokenTag')
    const SolanaToken = getModel('SolanaToken')

    const vQuery = query.q ? {$text: {$search: query.q}} : {}

    const _getItems = SolanaTokenTag
        .find(vQuery)
        .select('_id name')
        .lean()

    const [items] = await Promise.all([
        _getItems,
    ])

    const rItems = await Promise.all(items.map(async item => {
        const tokenCount = await SolanaToken.countDocuments({tag: item.name})
        return {
            ...item,
            tokens: tokenCount
        }
    }), {concurrency: 8})

    return {
        items: rItems,
    }
}