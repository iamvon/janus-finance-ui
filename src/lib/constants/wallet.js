export const TAB_NAMES = {
    COLLECTIONS: "COLLECTIONS",
    ITEMS: "ITEMS",
    ACTIVITIES: "ACTIVITIES",
}

export const TAB_VALUES = {
    [TAB_NAMES.COLLECTIONS]: "1",
    [TAB_NAMES.ITEMS]: "2",
    [TAB_NAMES.ACTIVITIES]: "3",
}

export const TAB_LABELS = {
    [TAB_NAMES.COLLECTIONS]: "Overview",
    [TAB_NAMES.ITEMS]: "NFTs",
    [TAB_NAMES.ACTIVITIES]: "Activities",
}

export const TAB_OPTIONS = [
    {
        value: TAB_VALUES[TAB_NAMES.COLLECTIONS],
        label: TAB_LABELS[TAB_NAMES.COLLECTIONS],
    },
    {
        value: TAB_VALUES[TAB_NAMES.ITEMS],
        label: TAB_LABELS[TAB_NAMES.ITEMS],
    },
    {
        value: TAB_VALUES[TAB_NAMES.ACTIVITIES],
        label: TAB_LABELS[TAB_NAMES.ACTIVITIES],
    },
]

export const DEFAULT_TAB_VALUE = TAB_VALUES[TAB_NAMES.COLLECTIONS]

export const WHALE_HOLDING_VALUE = 1000 * 1000 // 1M