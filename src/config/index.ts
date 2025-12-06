import 'dotenv/config'
const {
  PORT = '',
  MONGODB_URI = '',
  REDIS_URL = '',
  CACHE_TTL_SECONDS = ''
} = process.env

const REQUIRED_CONFIG = ['PORT', 'MONGODB_URI', 'REDIS_URL', 'CACHE_TTL_SECONDS']

const isTest = process.env.NODE_ENV === "test" || process.env.JEST_WORKER_ID !== undefined;

if (!isTest) {
  REQUIRED_CONFIG.forEach((key) => {
    if (!process.env[key]) {
      console.error(`[Error] Missing Config: ${key}`);
      process.exit(1);
    }
  });
}

const CONFIG = {
  PORT,
  MONGODB_URI,
  REDIS_URL,
  CACHE_TTL_SECONDS
}

export default CONFIG