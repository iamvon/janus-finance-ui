import {getWishlist} from "/src/lib/actions/wallet/getWishlist"

export const getWishlistController = async (req) => {
    const {wallet_key: walletKey} = {...req.query}
    return await getWishlist({walletKey})
}