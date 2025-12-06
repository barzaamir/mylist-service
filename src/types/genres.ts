export const GENRE_LIST = [
  'Action',
  'Comedy',
  'Drama',
  'Fantasy',
  'Horror',
  'Romance',
  'SciFi',
] as const

export type Genre = (typeof GENRE_LIST)[number]
