import {getExtendedWishlist, getWishlist} from "/src/lib/actions/wallet/getWishlist"
import {DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE} from "../../constants/pagination"
import {SORT_AND_FILTER_FIELD} from "../../helpers/sort-and-filter-field/token"

export const getWishlistController = async (req) => {
    const {wallet_key: walletKey} = {...req.query}
    return await getWishlist({walletKey})
}

export const getExtendedWishlistController = async (req) => {
    const {
        page,
        size,
        order_by: orderBy,
        order_direction: orderDirection,
        wallet_key: walletKey,
    } = {...req.query}

    const query = req.query
    const vPage = !isNaN(page) && isFinite(page) ? parseInt(page) : DEFAULT_PAGE_NUMBER
    const vSize = !isNaN(size) && isFinite(size) ? parseInt(size) : DEFAULT_PAGE_SIZE.GRID

    const _orderBy = {}

    if (orderBy && orderDirection) {
        _orderBy[orderBy] = parseInt(orderDirection)
    }

    const vQuery = {
        q: query.q ? query.q : null,
    }

    for (const key of Object.values(SORT_AND_FILTER_FIELD)) {
        vQuery[key] = {
            min: query[`${key}_min`],
            max: query[`${key}_max`],
        }
    }

    return await getExtendedWishlist({
        page: vPage,
        size: vSize,
        query: vQuery,
        orderBy: _orderBy,
        walletKey: walletKey
    })
}