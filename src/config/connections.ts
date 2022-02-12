import mongoose from 'mongoose'
import aws from 'aws-sdk'

const { AWS_ACCESS_KEY_ID, AWS_REGION, AWS_SECRET_ACCESS_KEY } = process.env

export const connection = mongoose.createConnection(
  process.env.MONGO_CONNECTION!, {
    // useUnifiedTopology: true,
    socketTimeoutMS: 0,
    keepAlive      : true
    // useNewUrlParser: true
  }
)

connection.on('connected', function() {
  console.log('MongoDB connected!')
})

connection.once('open', function() {
  console.log('MongoDB connection opened!')
})

aws.config.update({
  accessKeyId    : AWS_ACCESS_KEY_ID,
  region         : AWS_REGION,
  secretAccessKey: AWS_SECRET_ACCESS_KEY
})

export const s3 = new aws.S3({ signatureVersion: 'v4' })
export const ses = new aws.SES()
