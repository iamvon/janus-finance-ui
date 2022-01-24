import {connectToDatabase} from "/src/lib/connections/mongodb"
import {getModel} from "../../models"


const getOrCreateWalletWishlist = (walletKey) => {
    const WalletWishlist = getModel('WalletWishlist')
    return WalletWishlist.findOne({wallet_key: walletKey})
        .then(wishlist => {
            if (!wishlist) {
                return WalletWishlist.create({wallet_key: walletKey, wishlist: []})
            }
            return wishlist
        })
}

export const getWishlist = async ({walletKey}) => {
    await connectToDatabase()
    if (walletKey) return await getOrCreateWalletWishlist(walletKey)
    return Promise.reject(new Error('Error: wallet_key is required'))
}