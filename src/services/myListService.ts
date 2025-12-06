import MyListItemModel from '../models/myListItem.model'
import TVShowModel, { TVShow } from '../models/tvShow.model'
import { getUserListCache, setUserListCache, invalidateUserListCache } from './cache'
import { ContentType } from '../types/contentType'
import movieModel, { Movie } from '../models/movie.model'

const myListService = {
  addToMyList,
  removeFromMyList,
  listMyItems
}
export default myListService

async function addToMyList(
  userId: string,
  contentId: string,
  contentType: ContentType
) {
  const item = await MyListItemModel.create({
    userId,
    contentId,
    contentType
  })
  // Invalidate cache so the next list refresh is correct
  await invalidateUserListCache(userId)
  return item
}

async function removeFromMyList(
  userId: string,
  contentId: string,
  contentType: ContentType
) {
  const deleted = await MyListItemModel.deleteOne({ userId, contentId, contentType })
  // Invalidate cache so the next list refresh is correct
  await invalidateUserListCache(userId)
  return deleted
}


/**
 * Strategy:
 * - Try Redis cache
 * - If cache hit: slice page.
 * - If cache miss: query DB, populate minimal content details (title, type), set cache, return slice.
 */
async function listMyItems(userId: string, page = 1, limit = 20) {
  page = Math.max(1, page)
  limit = Math.min(100, Math.max(1, limit))

  // Serve from Redis cache if available
  const cache = await getUserListCache(userId)
  // if (cache) {
  //   const total = cache.length
  //   const start = (page - 1) * limit
  //   return {
  //     items: cache.slice(start, start + limit),
  //     total
  //   }
  // }

  // Fetch from DB
  const docs = await MyListItemModel.find({ userId }).lean().exec()
  if (!docs.length) {
    await setUserListCache(userId, [])
    return { items: [], total: 0, fromCache: false }
  }
  const movieIds: string[] = []
  const tvIds: string[] = []
  for (const d of docs) {
    if (d.contentType === "Movie") movieIds.push(d.contentId)
    else tvIds.push(d.contentId)
  }
  const [movies, tvshows] = await Promise.all([
    movieIds.length
      ? movieModel.find({ id: { $in: movieIds } }).lean().exec()
      : [],
    tvIds.length
      ? TVShowModel.find({ id: { $in: tvIds } }).lean().exec()
      : [],
  ])
  const movieMap = new Map<string, Movie>(
    movies.map((m): [string, Movie] => [m.id, m])
  )

  const tvMap = new Map<string, TVShow>(
    tvshows.map((t): [string, TVShow] => [t.id, t])
  )

  // Enrich list
  const enriched = docs.map((d) => {
    const content =
      d.contentType === "Movie"
        ? movieMap.get(d.contentId)
        : tvMap.get(d.contentId)

    return {
      contentId: d.contentId,
      contentType: d.contentType,
      title: content?.title ?? null,
      description: content?.description ?? null,
      addedAt: d.createdAt
    }
  })
  await setUserListCache(userId, enriched)
  const total = enriched.length
  const start = (page - 1) * limit
  return {
    items: enriched.slice(start, start + limit),
    total
  }
}
