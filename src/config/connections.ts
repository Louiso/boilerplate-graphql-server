import mongoose from 'mongoose'

export const connection = mongoose.createConnection(
  process.env.MONGO_CONNECTION as string, {
    useUnifiedTopology: true,
    socketTimeoutMS   : 0,
    keepAlive         : true
  }
)
