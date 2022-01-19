const prefix = ["", "K", "M", "B", "T"]

export const formatNumber = (value) => {
    if (value === undefined || value === null){
        return "--"
    }
    let _value = Math.abs(value)
    let count = 0
    const negative = value < 0 ? -1 : 1
    while (_value > 1000) {
        _value /= 1000
        count++
    }
    return new Intl.NumberFormat("en-US", {maximumFractionDigits: 2, minimumIntegerDigits: 1}).format(_value * negative) + prefix[count]
}