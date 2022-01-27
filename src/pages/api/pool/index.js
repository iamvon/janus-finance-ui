import {StatusCodes} from "http-status-codes"
import {sendError, sendSuccess} from "/src/lib/helpers/response"
import {listTokenController} from "/src/lib/controllers/token/listToken"
import {listPoolController} from "../../../lib/controllers/pool/listPool"

const handler = async (req, res) => {
    const {method} = req
    switch (method) {
        case "POST":
            return handlerPost(req, res)
        default:
            return res.status(StatusCodes.METHOD_NOT_ALLOWED).end("METHOD NOT ALLOWED")
    }
}

const handlerPost = async (req, res) => {
    try {
        const result = await listPoolController(req)
        return sendSuccess(res, result)
    } catch (error) {
        return sendError(res, error)
    }
}

export default handler