export const SORT_AND_FILTER_FIELD = {
    CREATED_TIME: "createdAt",
    NAME: "name",
    PRICE: "price"
}

export const PARSE_FLOAT_FIELDS = [SORT_AND_FILTER_FIELD.PRICE]

export const PARSE_DATE_FIELDS = [SORT_AND_FILTER_FIELD.CREATED_TIME]

export const convertFieldName = (key) => {
    switch (key) {
        case SORT_AND_FILTER_FIELD.PRICE:
            return `price`
        case SORT_AND_FILTER_FIELD.CREATED_TIME:
            return `createAt`
        default:
            return key
    }
}
