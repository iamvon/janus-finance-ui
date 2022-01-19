export const truncateHashCode = (str, max, sep) => {
    max = max || 15
    const len = str.length
    if (len > max) {
        sep = sep || "..."
        const seplen = sep.length
        if (seplen > max) {
            return str.substr(len - max)
        }

        const n = -0.5 * (max - len - seplen)
        const center = len / 2
        return str.substr(0, center - n) + sep + str.substr(len - center + n)
    }
    return str
}