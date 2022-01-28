const Mongoose = require("mongoose");
const {Schema} = Mongoose

const TokenSchema = new Schema(
    {
        chainId: {
            type: String,
            default: ""
        },
        price: {
            type: Number
        },
        address: {
            type: String,
            unique: true,
            index: true,
            default: ""
        },
        symbol: {
            type: String,
            index: true,
            default: ""
        },
        name: {
            type: String,
            index: true,
            default: ""
        },
        decimals: {
            type: Number
        },
        logoURI: {
            type: String,
            default: ""
        },
        tag: {
            type: [String],
            index: true,
            default: []
        },
        extensions: {
            type: Object,
            default: {}
        }
    },
    { timestamps: true }
)

TokenSchema.index({name: 'text', address: 'text', symbol: 'text'});

module.exports = Mongoose.models.SolanaToken || Mongoose.model("SolanaToken", TokenSchema, "Solana");