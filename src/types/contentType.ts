export const CONTENT_TYPES = ['Movie', 'TVShow'] as const

export type ContentType = (typeof CONTENT_TYPES)[number]
