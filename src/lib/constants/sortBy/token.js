// import {SORT_AND_FILTER_FIELD} from "/src/lib/helpers/sort-and-filter-field/items"

import {SORT_AND_FILTER_FIELD} from "../../helpers/sort-and-filter-field/token"

export const SORT_BY_OPTIONS = [
    {
        value: 1,
        label: "Price high to low",
        query: {
            [SORT_AND_FILTER_FIELD.PRICE]: -1
        }
    },
    {
        value: 2,
        label: "Price low to high",
        query: {
            [SORT_AND_FILTER_FIELD.PRICE]: 1
        }
    }
]