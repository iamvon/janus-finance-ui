export const SORT_AND_FILTER_FIELD = {
    NAME: "name",
    PRICE: "price",
    TOP_TRENDING_RANK: "topTrendingRank",
    TOP_SELL_RANK: "topSellRank",
    TOP_BUY_RANK: "topBuyRank",
}

export const PARSE_FLOAT_FIELDS = [SORT_AND_FILTER_FIELD.PRICE]

export const PARSE_DATE_FIELDS = []

export const convertFieldName = (key) => {
    switch (key) {
        case SORT_AND_FILTER_FIELD.PRICE:
            return `price`
        default:
            return key
    }
}
