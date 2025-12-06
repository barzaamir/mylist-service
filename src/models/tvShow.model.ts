import { Schema, model } from 'mongoose'
import { GENRE_LIST } from '../types/genres'

export interface Episode {
  episodeNumber?: number
  seasonNumber?: number
  releaseDate?: Date
  director?: string
  actors?: string[]
}

export interface TVShow {
  id: string
  title: string
  description: string
  genres: string[]
  episodes: Episode[]
  createdAt?: Date
  updatedAt?: Date
}

const EpisodeSchema = new Schema<Episode>({
  episodeNumber: Number,
  seasonNumber: Number,
  releaseDate: Date,
  director: String,
  actors: [String]
}, { _id: false })

const TVShowSchema = new Schema<TVShow>({
  id: { type: String, required: true, unique: true },
  title: String,
  description: String,
  genres: [{ type: String, enum: GENRE_LIST }],
  episodes: [EpisodeSchema]
}, { timestamps: true })


export default model<TVShow>('TVShow', TVShowSchema)
