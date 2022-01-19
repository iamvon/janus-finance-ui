import {MAX_RECORD_QUERY} from "/src/lib/constants/pagination"

export const getLimitQueryCount = (size) => {
    return Math.ceil(MAX_RECORD_QUERY / size) * size
}