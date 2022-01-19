import {StatusCodes} from "http-status-codes"

export const sendSuccess = (res, data) => {
    return res.status(StatusCodes.OK).json({
        success: true,
        data
    })
}

export const sendError = (res, error) => {
    const { message } = error;
    console.error(error)
    const obj = {
        success: false,
        message
    }
    return res.status(StatusCodes.BAD_REQUEST).json(obj)
}

export const sendNotFound = (res) => {
    const obj = {
        success: false,
        message: "NOT_FOUND"
    }
    return res.status(StatusCodes.NOT_FOUND).json(obj)
}