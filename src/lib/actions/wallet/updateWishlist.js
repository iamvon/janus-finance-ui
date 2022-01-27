import {connectToDatabase} from "/src/lib/connections/mongodb"
import {getModel} from "../../models"
import {WISHLIST_ACTION} from "../../constants/wallet"
import _ from 'lodash'

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

export const updateWishlist = async ({walletKey, action, tokenAddress}) => {
    await connectToDatabase()
    const WalletWishlist = getModel('WalletWishlist')
    if (action === WISHLIST_ACTION.ADD) {
        return getOrCreateWalletWishlist(walletKey)
            .then(wishlist => {
                const {wishlist: currentWishlist} = wishlist
                const newWishlist = _.uniq([...currentWishlist, tokenAddress])
                return wishlist.update({wishlist: newWishlist})
            })
    } else if (action === WISHLIST_ACTION.REMOVE) {
        return WalletWishlist.findOne({wallet_key: walletKey})
            .then(wishlist => {
                const {wishlist: currentWishlist} = wishlist
                const newWishlist = currentWishlist.filter(address => address !== tokenAddress)
                return wishlist.update({wishlist: newWishlist})
            })
    }

}