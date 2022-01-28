
export const renderPlatformIconUrl = (platform) => {
    const str = String(platform).toUpperCase()
    switch (str){
        case "RAYDIUM":
            return "/icons/raydium.png"
        case "ALDRIN":
            return "/icons/aldrin.jpg"
        case "ORCA":
            return "/icons/orca.svg"
        default:
            return
    }
}