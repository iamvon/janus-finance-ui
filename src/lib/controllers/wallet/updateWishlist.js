import {updateWishlist} from "/src/lib/actions/wallet/updateWishlist"

export const updateWishlistController = async (req) => {
    const {walletKey, action, tokenAddress} = {...req.body}
    return await updateWishlist({walletKey, action, tokenAddress})
}