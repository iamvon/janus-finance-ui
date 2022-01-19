export const ETH_SCAN_BASE_URL = "https://etherscan.io"

export const convertToEtherScanUrl = (data, isCollection = true) => {
    if (isCollection) {
        return `${ETH_SCAN_BASE_URL}/address/${data?.smart_contract}`
    } else {
        return `${ETH_SCAN_BASE_URL}/tx/${data?.tx_hash}`
    }
}
