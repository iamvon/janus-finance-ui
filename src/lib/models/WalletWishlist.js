const Mongoose = require("mongoose");
const {Schema} = Mongoose


const WalletWishlistSchema = new Schema(
    {
        wallet_key: {
            type: String,
            unique: true,
            required: true,
            index: true,
        },
        wishlist: [
            {
                type: String,
            }
        ]
    },
    {timestamps: true}
)

module.exports = Mongoose.models.WalletWishlist || Mongoose.model("WalletWishlist", WalletWishlistSchema, "walletwishlist");