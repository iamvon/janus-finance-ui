export function abbreviateAddress(address, size = 5) {
    const base58 = address.toBase58()
    return base58.slice(0, size) + '…' + base58.slice(-size)
  }


export const checkMatchMediaQuery = (query = "only screen and (max-width: 760px)") => {
    return typeof window === "undefined" ? false : window.matchMedia(query).matches
}