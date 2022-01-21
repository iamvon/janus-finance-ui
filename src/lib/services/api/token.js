import {createApiRequest} from "./index"

export const getTokenListApi = (params) => {
    return createApiRequest({
        url: `/token`,
        method: 'GET',
        params: params
    })
}