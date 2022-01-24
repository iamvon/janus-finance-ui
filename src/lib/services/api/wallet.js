import {createApiRequest} from "./index"

export const getWishlistListApi = (params) => {
    return createApiRequest({
        url: `/wallet/wishlist`,
        method: 'GET',
        params: params
    })
}

export const updateWishlistListApi = (data) => {
    return createApiRequest({
        url: `/wallet/wishlist`,
        method: 'POST',
        data: data
    })
}