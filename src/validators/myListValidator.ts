import { Request, Response, NextFunction } from "express"
import { CONTENT_TYPES, ContentType } from "../types/contentType"
import response from "../utils/response"
const DEFAULT_PAGE = 1
const DEFAULT_LIMIT = 20
const { failure } = response

const myListValidator = {
  validateAdd,
  validateList,
  validateRemove
}

export default myListValidator

function validateAdd(req: Request, res: Response, next: NextFunction) {
  const { contentId, contentType } = req.body
  if (!contentId || !contentType) {
    return res.json(
      failure(400, "Both contentId and contentType are required.")
    )
  }
  if (!CONTENT_TYPES.includes(contentType)) {
    return res.json(
      failure(400, "Invalid contentType. Allowed: Movie, TVShow.")
    )
  }
  next()
}

function validateRemove(req: Request, res: Response, next: NextFunction) {
  const { contentId } = req.params
  const contentType = req.query.contentType as ContentType
  if (!contentId || !contentType) {
    return res.json(
      failure(400, "Both contentId and contentType are required.")
    )
  }
  if (!CONTENT_TYPES.includes(contentType)) {
    return res.json(
      failure(400, "Invalid contentType. Allowed: Movie, TVShow.")
    )
  }
  next()
}

function validateList(req: Request, res: Response, next: NextFunction) {
  const page = req.query.page ? Number(req.query.page) : DEFAULT_PAGE
  const limit = req.query.limit ? Number(req.query.limit) : DEFAULT_LIMIT
  if (Number.isNaN(page) || page < 1) {
    return res.json(
      failure(400, "page must be a positive number.")
    )
  }
  if (Number.isNaN(limit) || limit < 1 || limit > 100) {
    return res.json(
      failure(400, "limit must be a number between 1 and 100.")
    )
  }
  next()
}
