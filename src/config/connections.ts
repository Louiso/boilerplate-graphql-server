import mongoose from 'mongoose'

export const connection = process.env.MONGO_CONNECTION ? mongoose.createConnection(
  process.env.MONGO_CONNECTION as string, {
    useUnifiedTopology: true,
    socketTimeoutMS   : 0,
    keepAlive         : true
  }
) : null
