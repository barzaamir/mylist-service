import { Request, Response } from 'express'
import MyListService from '../services/myListService'
import { ContentType } from '../types/contentType'
import response from "../utils/response"
const { success, failure } = response

const DEFAULT_PAGE = 1
const DEFAULT_LIMIT = 20

const myListController = {
  add,
  remove,
  list
}

export default myListController

/**
 * POST /my-list
 * body: { contentId: string, contentType: 'Movie' | 'TVShow' }
 */
async function add(req: Request, res: Response) {
  try {
    const userId = (req as any).userId
    const { contentId, contentType } = req.body
    // Add to list
    const data = await MyListService.addToMyList(
      userId,
      contentId,
      contentType
    )
    return res.json(
      success(201, `Added ${contentType} (${contentId}) to your list successfully.`, data)
    )
  } catch (err: any) {
    console.error(err)
    if (err.code === 11000) {
      return res.json(
        failure(409, "Item is already in your list.")
      )
    }
    return res.json(
      failure(500, "An unexpected error occurred. Please try again later.")
    )
  }
}


/**
 * DELETE /my-list/:contentId?contentType=Movie
 */
async function remove(req: Request, res: Response) {
  try {
    const userId = (req as any).userId
    const { contentId } = req.params
    const contentType = req.query.contentType as ContentType

    // Delete from list
    const removed = await MyListService.removeFromMyList(
      userId,
      contentId,
      contentType
    )
    return res.json(
      success(201, `Removed ${contentType} (${contentId}) from your list successfully.`, removed)
    )
  } catch (err: any) {
    console.error(err)
    return res.json(
      failure(500, "An unexpected error occurred. Please try again later.")
    )
  }
}


/**
 * GET /my-list?page=1&limit=20
 */
async function list(req: Request, res: Response) {
  try {
    const { userId } = (req as any)
    const { page = DEFAULT_PAGE, limit = DEFAULT_LIMIT } = req.query

    // Fetch list
    const { items, total } = await MyListService.listMyItems(
      userId,
      Number(page),
      Number(limit)
    )
    return res.json(
      success(200, "Fetched items from your list successfully.", {
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / Number(limit))
        },
        items
      })
    )
  } catch (err: any) {
    console.error(err)
    return res.json(
      failure(500, "An unexpected error occurred. Please try again later.")
    )
  }
}

