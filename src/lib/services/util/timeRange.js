export const range24H = 1
export const range7D = 2
export const range1M = 3
export const range3M = 4
export const range1Y = 5
export const rangeAll = 6

export const getDateFromRange = (range) => {
    let timePerDay = 24 * 60 * 60 * 1000
    // All the time by default
    let to = new Date()
    let from = null

    if (range === range24H || range === 't24h') {
        from = new Date(to.getTime() - (timePerDay));
    }
    else if (range === range7D || range === 't7d') {
        from = new Date(to.getTime() - (timePerDay * 7))
    }
    else if (range === range1M || range === 't30d') {
        from = new Date(to.getTime() - (timePerDay * 31))
    }
    else if (range === range3M) {
        from = new Date(to.getTime() - (timePerDay * 93))
    }
    else if (range === range1Y) {
        from = new Date(to.getTime() - (timePerDay * 365))
    }
    else if (range === 'tAll') {
        from = new Date("2009-1-3T00:00:00")
    }
    return {from, to}
}
