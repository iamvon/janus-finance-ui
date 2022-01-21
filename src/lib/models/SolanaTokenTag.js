const Mongoose = require("mongoose");
const {Schema} = Mongoose


const TagSchema = new Schema(
    {
        name: {
            type: String,
            index: true,
            default: ""
        },
    },
    {timestamps: true}
)

module.exports = Mongoose.models.SolanaTokenTag || Mongoose.model("SolanaTokenTag", TagSchema, "tag");