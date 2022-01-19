import moment from "moment"

export const TIME_NAME = {
    __7_DAYS: "__7_DAYS",
    __2_WEEKS: "__2_WEEKS",
    __1_MONTH: "__1_MONTH",
    __3_MONTHS: "__3_MONTHS",
    __1_YEAR: "__1_YEAR",
    ALL_TIME: "ALL_TIME",
}

export const ALL_TIME_VALUE = -1

const TIME_VALUE = {
    [TIME_NAME.__7_DAYS]: 1,
    [TIME_NAME.__2_WEEKS]: 2,
    [TIME_NAME.__1_MONTH]: 3,
    [TIME_NAME.__3_MONTHS]: 4,
    [TIME_NAME.__1_YEAR]: 5,
    [TIME_NAME.ALL_TIME]: ALL_TIME_VALUE,
}

const TIME_LABEL = {
    [TIME_NAME.__7_DAYS]: "Last 7 days",
    [TIME_NAME.__2_WEEKS]: "Last 2 weeks",
    [TIME_NAME.__1_MONTH]: "Last month",
    [TIME_NAME.__3_MONTHS]: "Last 3 months",
    [TIME_NAME.__1_YEAR]: "Last year",
    [TIME_NAME.ALL_TIME]: "All time",
}


export const TIME_OPTIONS = [
    {
        value: TIME_VALUE[TIME_NAME.__7_DAYS],
        label: TIME_LABEL[TIME_NAME.__7_DAYS]
    },
    {
        value: TIME_VALUE[TIME_NAME.__2_WEEKS],
        label: TIME_LABEL[TIME_NAME.__2_WEEKS]
    },
    {
        value: TIME_VALUE[TIME_NAME.__1_MONTH],
        label: TIME_LABEL[TIME_NAME.__1_MONTH]
    },
    {
        value: TIME_VALUE[TIME_NAME.__3_MONTHS],
        label: TIME_LABEL[TIME_NAME.__3_MONTHS]
    },
    {
        value: TIME_VALUE[TIME_NAME.__1_YEAR],
        label: TIME_LABEL[TIME_NAME.__1_YEAR]
    },
    {
        value: TIME_VALUE[TIME_NAME.ALL_TIME],
        label: TIME_LABEL[TIME_NAME.ALL_TIME]
    }
]


export const parseTimeFromTimeOption = (value) => {
    let since, until
    until = moment()
    switch (value) {
        case TIME_VALUE[TIME_NAME.__7_DAYS]:
            since = until.subtract(7, "days")
            break
        case TIME_VALUE[TIME_NAME.__2_WEEKS]:
            since = until.subtract(2, "weeks")
            break
        case TIME_VALUE[TIME_NAME.__1_MONTH]:
            since = until.subtract(1, "months")
            break
        case TIME_VALUE[TIME_NAME.__3_MONTHS]:
            since = until.subtract(3, "months")
            break
        case TIME_VALUE[TIME_NAME.__1_YEAR]:
            since = until.subtract(1, "years")
            break
        case TIME_VALUE[TIME_NAME.ALL_TIME]:
        default:
            until = null
            since = null
            break
    }
    const result = {
        since: since ? since.toDate() : null,
        until: until ? until.toDate() : null,
    }
    return [result.since, result.until]
}
