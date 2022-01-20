import mongoose from 'mongoose'

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/spy-NFTDetail-database'

export const connectToDatabase = async () => {
    try {
        if (mongoose.connections[0].readyState) {
            return mongoose.connections[0]
        }
        return mongoose.connect(uri, {
            useNewUrlParser: true,
            useFindAndModify: false,
            useUnifiedTopology: true,
            useCreateIndex: true
        }).then((conn) => console.log("> Connect to MongoDB successfully!"))
            .catch((err) => console.error("> Failed to connect to MongoDB: ", err))
    } catch (error) {
        console.error("> Failed to connect to MongoDB: ", error.toString())
    }
}