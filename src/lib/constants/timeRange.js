export const TIME_RANGES = {
    __24_HOURS: "__24_HOURS",
    __7_DAYS: "__7_DAYS",
    __30_DAYS: "__30_DAYS",
}


export const DEFAULT_TIME_RANGE = "t24h"

export const TIME_RANGE_VALUES = {
    [TIME_RANGES.__24_HOURS]: DEFAULT_TIME_RANGE,
    [TIME_RANGES.__7_DAYS]: "t7d",
    [TIME_RANGES.__30_DAYS]: "t30d",
}