import {StatusCodes} from "http-status-codes"
import {sendError, sendSuccess} from "/src/lib/helpers/response"
import {listTokenController} from "/src/lib/controllers/token/listToken"

const handler = async (req, res) => {
    const {method} = req
    switch (method) {
        case "GET":
            return handlerGet(req, res)
        default:
            return res.status(StatusCodes.METHOD_NOT_ALLOWED).end("METHOD NOT ALLOWED")
    }
}

const handlerGet = async (req, res) => {
    try {
        const result = await listTokenController(req)
        return sendSuccess(res, result)
    } catch (error) {
        return sendError(res, error)
    }
}

export default handler