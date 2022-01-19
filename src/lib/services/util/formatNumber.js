//1000.12345 -> 1,000; 1000,654321 -> 1,001
export const formatLocaleNumber = (number) => {
    return number.toLocaleString('en-UK', {maximumFractionDigits: 0})
}

//1000.12345 -> 1k
export const formatNumber = (number) => {
    return new Intl.NumberFormat('en-GB', {
        notation: "compact",
        compactDisplay: "short"
    }).format(number);
}
const englishOrdinalRules = new Intl.PluralRules("en", {type: "ordinal"})

const suffixes = {
    one: "st",
    two: "nd",
    few: "rd",
    other: "th"
}

// 1 -> st; 2 -> nd; 3 -> rd; other -> th
export const formatOrdinal = (number) => {
    const suffix = suffixes[englishOrdinalRules.select(number)]
    return suffix
}