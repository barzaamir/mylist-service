import express from 'express'
import bodyParser from 'body-parser'
import myListRoutes from './routes/myList'
import mockAuth from './middleware/mockAuth'

const app = express()
app.use(bodyParser.json())
app.use(mockAuth)

// myList routes
app.use('/my-list', myListRoutes)

// health check
app.get('/health', (_req, res) => res.json({ ok: true }))

export default app
