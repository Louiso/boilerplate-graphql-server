import redis from 'redis'

const {
  REDIS_HOST,
  REDIS_PORT
} = process.env

export const redisClient = redis.createClient({ host: REDIS_HOST, port: REDIS_PORT ? parseInt(REDIS_PORT) : undefined })

redisClient.on('error', (error) => { console.log('[REDIS] Redis cannot connect:', error)})
redisClient.on('connect', () => {console.log('[REDIS] redis is connect')})

export const getRedis = async (key: string) =>
  new Promise((resolve, reject) => {
    redisClient.get(key, (err, reply) => {
      if(err)
        reject(err)
      else
        resolve(reply ? JSON.parse(reply) : undefined)
    })
  })

export const setRedis = async (key: string, value: string | Record<string, any>, duration = 60) =>
  new Promise((resolve, reject) => {
    redisClient.set(
      key, typeof value === 'object' ? JSON.stringify(value) : value,
      'EX',
      duration,
      (err, reply) => {
        if(err)
          reject(err)
        else
          resolve(reply)
      })
  })
