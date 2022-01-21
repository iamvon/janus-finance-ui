import {listTokenTag} from "../../actions/token/listTokenTag"

export const listTokenTagController = async (req) => {
    const query = req.query

    const vQuery = {
        q: query && query.q ? query.q : null,
    }

    return await listTokenTag({
        query: vQuery,
    })
}