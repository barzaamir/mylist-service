import { RequestHandler } from 'express'

const mockAuth: RequestHandler = (req, res, next) => {
  const uid = req.header('x-user-id') || 'test-user';
  // attach userId to request
  (req as any).userId = uid
  next()
}

export default mockAuth
