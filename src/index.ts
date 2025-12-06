import app from './app'
import CONFIG from './config'
import { connectMongoose } from './db/mongoose'

const { PORT, MONGODB_URI = '' } = CONFIG

async function start() {
  await connectMongoose(MONGODB_URI)
  app.listen(PORT, () => {
    console.log(`Listening on ${PORT}`)
  })
}

start().catch(err => {
  console.error('Failed to start', err)
  process.exit(1)
})
