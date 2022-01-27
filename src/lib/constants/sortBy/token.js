// import {SORT_AND_FILTER_FIELD} from "/src/lib/helpers/sort-and-filter-field/items"

import {SORT_AND_FILTER_FIELD} from "../../helpers/sort-and-filter-field/token"

export const SORT_BY_OPTIONS = [
    {
        value: 1,
        label: "Price low to high",
        query: {
            [SORT_AND_FILTER_FIELD.PRICE]: -1
        },
        direction: 'descend',
        field: SORT_AND_FILTER_FIELD.PRICE
    },
    {
        value: 2,
        label: "Price high to low",
        query: {
            [SORT_AND_FILTER_FIELD.PRICE]: 1
        },
        direction: 'ascend',
        field: SORT_AND_FILTER_FIELD.PRICE
    }
]

