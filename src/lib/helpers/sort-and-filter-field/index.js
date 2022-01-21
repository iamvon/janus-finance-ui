import {isNonValue} from "/src/lib/services/util/object"
import moment from "moment"
import {
    PARSE_DATE_FIELDS as TOKEN_FIELD_DATE,
    PARSE_FLOAT_FIELDS as TOKEN_FIELD_FLOAT
} from "/src/lib/helpers/sort-and-filter-field/token"


export const PARSE_FLOAT_FIELDS = [...TOKEN_FIELD_FLOAT]
export const PARSE_DATE_FIELDS = [...TOKEN_FIELD_DATE]

export const renderFilterTitle = (key, value, prefix, suffix) => {
    let result = []
    if (PARSE_FLOAT_FIELDS.includes(key)) {
        if (!isNonValue(value.min)) {
            result.push(`From ${prefix ? prefix : ""}${value.min}${suffix ? suffix : ""}`)
        }
        if (!isNonValue(value.max)) {
            result.push(`To ${prefix ? prefix : ""}${value.max}${suffix ? suffix : ""}`)
        }
    }
    if (PARSE_DATE_FIELDS.includes(key)) {
        if (!isNonValue(value.min)) {
            result.push(`From ${moment(value.min).format("YYYY-MM-DD")}`)
        }
        if (!isNonValue(value.max)) {
            result.push(`To ${moment(value.max).format("YYYY-MM-DD")}`)
        }
    }

    return result.join(" ")
}

export const parseDataFromString = (key, value) => {
    if (PARSE_FLOAT_FIELDS.includes(key)) {
        return parseFloat(value)
    }
    if (PARSE_DATE_FIELDS.includes(key)) {
        return new Date(value)
    }
    return value
}