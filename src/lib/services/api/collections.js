import {createApiRequest} from './index'

export const getItemsByRarityApi = ({slug, params}) => {
    return createApiRequest({
        url: `/collections/${slug}/items-by-rarity`,
        method: 'get',
        params: params
    })
}

export const collectionAutocompleteApi = (params) => {
    return createApiRequest({
        url: `/collections/autocomplete`,
        method: 'get',
        params: params
    })
}

export const collectionActivityApi = ({slug, params}) => {
    return createApiRequest({
        url: `/collections/${slug}/collection-activity`,
        method: 'get',
        params: params
    })
}

export const collectionStatisticsApi = ({slug, params}) => {
    return createApiRequest({
        url: `/collections/${slug}/statistics`,
        method: 'get',
        params: params
    })
}

export const whaleCountApi = ({slug, params}) => {
    return createApiRequest({
        url: `/collections/${slug}/whale-count`,
        method: 'get',
        params: params
    })
}

export const topHoldersApi = ({slug, params}) => {
    return createApiRequest({
        url: `/collections/${slug}/top-holders`,
        method: 'get',
        params: params
    })
}

export const allHoldersApi =  ({slug, params}) => {
    return createApiRequest({
        url: `/collections/${slug}/all-holders`,
        method: 'get',
        params: params
    })
}

export const searchCollectionsApi = (params) => {
    return createApiRequest({
        url: `/collections`,
        method: 'get',
        params: params
    })
}

export const getCollectionDetail = ({slug}) => {
    return createApiRequest({
        url: `/collections/${slug}`,
        method: 'get'
    })
}

export const getCollectionItems = ({slug, params}) => {
    return createApiRequest({
        url: `/collections/${slug}/items`,
        method: 'get',
        params: params
    })
}

export const getRecentlyCreated = ({smartContract, params}) => {
    return createApiRequest({
        url: `/collections/${smartContract}/mint-history`,
        method: 'get',
        params: params
    })
}

export const getSalesHistory = ({smartContract, params}) => {
    return createApiRequest({
        url: `/collections/${smartContract}/sale-history`,
        method: 'get',
        params: params
    })
}

export const getTopSale = ({smartContract, params}) => {
    return createApiRequest({
        url: `/collections/${smartContract}/top-sale`,
        method: 'get',
        params: params
    })
}