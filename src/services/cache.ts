import Redis from 'ioredis'
import CONFIG from '../config'
const { REDIS_URL, CACHE_TTL_SECONDS } = CONFIG

const redisUrl = REDIS_URL

export const redisClient = redisUrl ? new Redis(redisUrl) : new Redis() // defaults to localhost:6379

const TTL = Number(CACHE_TTL_SECONDS || 300)

/**
 * Key format: mylist:{userId}
 * We'll store JSON array of objects: { contentId, contentType, title? } to avoid multiple roundtrips
 */

export async function setUserListCache(userId: string, items: any[]) {
  const key = `mylist:${userId}`
  // store stringified array
  await redisClient.set(key, JSON.stringify(items), 'EX', TTL)
}

export async function getUserListCache(userId: string) {
  const key = `mylist:${userId}`
  const v = await redisClient.get(key)
  if (!v) return null
  try {
    return JSON.parse(v)
  } catch {
    return null
  }
}

export async function invalidateUserListCache(userId: string) {
  const key = `mylist:${userId}`
  await redisClient.del(key)
}
