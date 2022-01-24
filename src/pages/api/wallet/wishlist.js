import {StatusCodes} from "http-status-codes"
import {sendError, sendSuccess} from "/src/lib/helpers/response"
import {getWishlistController} from "../../../lib/controllers/wallet/getWishlist"
import {updateWishlistController} from "../../../lib/controllers/wallet/updateWishlist"

const handler = async (req, res) => {
    const {method} = req
    switch (method) {
        case "GET":
            return handlerGet(req, res)
        case "POST":
            return handlerPost(req, res)
        default:
            return res.status(StatusCodes.METHOD_NOT_ALLOWED).end("METHOD NOT ALLOWED")
    }
}

const handlerGet = async (req, res) => {
    try {
        const result = await getWishlistController(req)
        return sendSuccess(res, result)
    } catch (error) {
        return sendError(res, error)
    }
}

const handlerPost = async (req, res) => {
    try {
        const result = await updateWishlistController(req)
        return sendSuccess(res, result)
    } catch (error) {
        return sendError(res, error)
    }
}

export default handler