import {createApiRequest} from "./index"

export const getPoolListApi = (params) => {
    return createApiRequest({
        url: `/pool`,
        method: 'GET',
        params: params
    })
}