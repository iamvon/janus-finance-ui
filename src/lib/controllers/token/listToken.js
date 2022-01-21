import {DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE} from "/src/lib/constants/pagination"
import {SORT_AND_FILTER_FIELD} from "/src/lib/helpers/sort-and-filter-field/token"
import {listToken} from "/src/lib/actions/token/listToken"
import {ta} from "react-date-range/dist/locale"

export const listTokenController = async (req) => {
    const {
        page,
        size,
        order_by: orderBy,
        order_direction: orderDirection,
    } = {...req.query}

    const query = req.query
    const vPage = !isNaN(page) && isFinite(page) ? parseInt(page) : DEFAULT_PAGE_NUMBER
    const vSize = !isNaN(size) && isFinite(size) ? parseInt(size) : DEFAULT_PAGE_SIZE.GRID
    const tags = query['tags[]'] ? query['tags[]'] : query['tags']
    const vTags = Array.isArray(tags) ? [...tags] : (tags ? [tags] : null)

    const _orderBy = {}

    if (orderBy && orderDirection) {
        _orderBy[orderBy] = parseInt(orderDirection)
    }

    const vQuery = {
        q: query.q ? query.q : null,
        tags: vTags
    }

    for (const key of Object.values(SORT_AND_FILTER_FIELD)) {
        vQuery[key] = {
            min: query[`${key}_min`],
            max: query[`${key}_max`],
        }
    }

    return await listToken({
        page: vPage,
        size: vSize,
        query: vQuery,
        orderBy: _orderBy
    })
}