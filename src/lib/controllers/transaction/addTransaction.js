import {listPool} from "../../actions/pool/listPool"

export const listPoolController = async (req) => {
    const {
        inputToken,
        inputAmount,
        inputPrice,
        outputToken,
        outputAmount,
        outputPrice,
    } = {...req.body}

    return await listPool({
        page: vPage,
        size: vSize,
        query: query,
        orderBy: _orderBy
    })
}