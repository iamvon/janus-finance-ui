import mongoose from 'mongoose'

export const withMongoDBConnectHandler = handler => async (req, res) => {
    // console.log("withMongoDBConnectHandler", process.env.MONGO_URI)
    try {
        if (mongoose.connections[0].readyState) {
            // Use current mongodb connection
            return handler(req, res)
        }
        // Use new mongodb connection
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useFindAndModify: false,
            useUnifiedTopology: true,
            useCreateIndex: true
        })
        console.log("Connect to MongoDB successfully!")
        return handler(req, res)
    } catch (error) {
        console.error("> Failed to connect to MongoDB: ", error.toString())
    }
}

export const withMongoDBConnectCtrl = controller => async (req) => {
    try {
        if (mongoose.connections[0].readyState) {
            // Use current mongodb connection
            return controller(req)
        }
        // Use new mongodb connection
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useFindAndModify: false,
            useUnifiedTopology: true,
            useCreateIndex: true
        })
        console.log("Connect to MongoDB successfully!")
        return controller(req)
    } catch (error) {
        console.error("> Failed to connect to MongoDB: ", error.toString())
    }
}
