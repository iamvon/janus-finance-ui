import {DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE} from "/src/lib/constants/pagination"
import {SORT_AND_FILTER_FIELD} from "/src/lib/helpers/sort-and-filter-field/token"
import {listPool} from "../../actions/pool/listPool"
import {ta} from "react-date-range/dist/locale"

export const listPoolController = async (req) => {
    const {
        page,
        size,
        order_by: orderBy,
        order_direction: orderDirection,
    } = {...req.body}

    const query = req.body
    const vPage = !isNaN(page) && isFinite(page) ? parseInt(page) : DEFAULT_PAGE_NUMBER
    const vSize = !isNaN(size) && isFinite(size) ? parseInt(size) : DEFAULT_PAGE_SIZE.GRID

    const _orderBy = {}

    if (orderBy && orderDirection) {
        _orderBy[orderBy] = parseInt(orderDirection)
    }

    const vQuery = {
        q: query.q ? query.q : null,
    }

    // for (const key of Object.values(SORT_AND_FILTER_FIELD)) {
    //     vQuery[key] = {
    //         min: query[`${key}_min`],
    //         max: query[`${key}_max`],
    //     }
    // }

    return await listPool({
        page: vPage,
        size: vSize,
        query: vQuery,
        orderBy: _orderBy
    })
}