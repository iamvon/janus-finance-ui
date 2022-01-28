// import {SORT_AND_FILTER_FIELD} from "/src/lib/helpers/sort-and-filter-field/items"

import {SORT_AND_FILTER_FIELD} from "../../helpers/sort-and-filter-field/token"

export const SORT_BY_OPTIONS = [
    {
        value: 1,
        label: "Top trending",
        query: {
            [SORT_AND_FILTER_FIELD.TOP_TRENDING_RANK]: 1
        },
        direction: 'ascend',
        field: SORT_AND_FILTER_FIELD.TOP_TRENDING_RANK
    },
    {
        value: 2,
        label: "Top sell",
        query: {
            [SORT_AND_FILTER_FIELD.TOP_SELL_RANK]: 1
        },
        direction: 'ascend',
        field: SORT_AND_FILTER_FIELD.TOP_SELL_RANK
    },
    {
        value: 3,
        label: "Top buy",
        query: {
            [SORT_AND_FILTER_FIELD.TOP_BUY_RANK]: 1
        },
        direction: 'ascend',
        field: SORT_AND_FILTER_FIELD.TOP_BUY_RANK
    },
    {
        value: 4,
        label: "Price high to low",
        query: {
            [SORT_AND_FILTER_FIELD.PRICE]: -1
        },
        direction: 'descend',
        field: SORT_AND_FILTER_FIELD.PRICE
    },
    {
        value: 5,
        label: "Price low to high",
        query: {
            [SORT_AND_FILTER_FIELD.PRICE]: 1
        },
        direction: 'ascend',
        field: SORT_AND_FILTER_FIELD.PRICE
    },
    {
        value: 6,
        label: "Top market cap",
        query: {
            [SORT_AND_FILTER_FIELD.MARKET_CAP]: -1
        },
        direction: 'descend',
        field: SORT_AND_FILTER_FIELD.MARKET_CAP
    },
    {
        value: 7,
        label: "Top volume",
        query: {
            [SORT_AND_FILTER_FIELD.VOLUME]: -1
        },
        direction: 'descend',
        field: SORT_AND_FILTER_FIELD.VOLUME
    }
]

