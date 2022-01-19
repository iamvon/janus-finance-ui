export const isEmpty = (obj) => {
    return obj && Object.keys(obj).length === 0 && Object.getPrototypeOf(obj) === Object.prototype
}

export const isFilterEmpty = (filter) => {
    return isNonValue(filter.min) && isNonValue(filter.max)
}

export const isNonValue = (value) => {
    return value === undefined || value === null
}


export const removeEmpty = (obj) => {
    return Object.entries(obj).reduce((a,[k,v]) => (v == null ? a : (a[k]=v, a)), {})
}