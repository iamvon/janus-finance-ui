export const EVENT_ORIGIN = {
    MINTED: "minted",
    TRANSFER: "transfer",
    SALE: "sale",
    BURN: "burn"
}

export const EVENT_BY_WALLET_NAMES = {
    BUY: "BUY",
    MINT: "MINT",
    SELL: "SELL",
    BURN: "BURN",
    SEND: "SEND",
    RECEIVE: "RECEIVE",
}

export const EVENT_BY_WALLET_VALUES = {
    [EVENT_BY_WALLET_NAMES.BUY]: "buy",
    [EVENT_BY_WALLET_NAMES.MINT]: "mint",
    [EVENT_BY_WALLET_NAMES.SELL]: "sell",
    [EVENT_BY_WALLET_NAMES.BURN]: "burn",
    [EVENT_BY_WALLET_NAMES.SEND]: "send",
    [EVENT_BY_WALLET_NAMES.RECEIVE]: "receive",
}

export const EVENT_BY_WALLET_LABELS = {
    [EVENT_BY_WALLET_NAMES.BUY]: "Buy",
    [EVENT_BY_WALLET_NAMES.MINT]: "Mint",
    [EVENT_BY_WALLET_NAMES.SELL]: "Sell",
    [EVENT_BY_WALLET_NAMES.BURN]: "Burn",
    [EVENT_BY_WALLET_NAMES.SEND]: "Send",
    [EVENT_BY_WALLET_NAMES.RECEIVE]: "Receive",
}

export const EVENT_BY_WALLET_OPTIONS = [
    {
        key: EVENT_BY_WALLET_VALUES[EVENT_BY_WALLET_NAMES.MINT],
        label: EVENT_BY_WALLET_LABELS[EVENT_BY_WALLET_NAMES.MINT],
    },
    {
        key: EVENT_BY_WALLET_VALUES[EVENT_BY_WALLET_NAMES.BUY],
        label: EVENT_BY_WALLET_LABELS[EVENT_BY_WALLET_NAMES.BUY],
    },
    {
        key: EVENT_BY_WALLET_VALUES[EVENT_BY_WALLET_NAMES.SELL],
        label: EVENT_BY_WALLET_LABELS[EVENT_BY_WALLET_NAMES.SELL],
    },
    {
        key: EVENT_BY_WALLET_VALUES[EVENT_BY_WALLET_NAMES.SEND],
        label: EVENT_BY_WALLET_LABELS[EVENT_BY_WALLET_NAMES.SEND],
    },
    {
        key: EVENT_BY_WALLET_VALUES[EVENT_BY_WALLET_NAMES.RECEIVE],
        label: EVENT_BY_WALLET_LABELS[EVENT_BY_WALLET_NAMES.RECEIVE],
    },
    {
        key: EVENT_BY_WALLET_VALUES[EVENT_BY_WALLET_NAMES.BURN],
        label: EVENT_BY_WALLET_LABELS[EVENT_BY_WALLET_NAMES.BURN],
    },
]

export const EVENT_TRACKING_OPTIONS = [
    {
        key: EVENT_BY_WALLET_VALUES[EVENT_BY_WALLET_NAMES.MINT],
        label: EVENT_BY_WALLET_LABELS[EVENT_BY_WALLET_NAMES.MINT],
    },
    {
        key: EVENT_BY_WALLET_VALUES[EVENT_BY_WALLET_NAMES.BUY],
        label: EVENT_BY_WALLET_LABELS[EVENT_BY_WALLET_NAMES.BUY],
    },
    {
        key: EVENT_BY_WALLET_VALUES[EVENT_BY_WALLET_NAMES.SELL],
        label: EVENT_BY_WALLET_LABELS[EVENT_BY_WALLET_NAMES.SELL],
    },
    {
        key: EVENT_BY_WALLET_VALUES[EVENT_BY_WALLET_NAMES.BURN],
        label: EVENT_BY_WALLET_LABELS[EVENT_BY_WALLET_NAMES.BURN],
    },
]