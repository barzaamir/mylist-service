import { Schema, model } from 'mongoose'
import { GENRE_LIST } from '../types/genres'

export interface Movie {
  id: string
  title: string
  description: string
  genres: string[]
  releaseDate: Date
  director: string
  actors: string[]
  createdAt?: Date
  updatedAt?: Date
}

const MovieSchema = new Schema<Movie>({
  id: { type: String, required: true, unique: true },
  title: String,
  description: String,
  genres: [{ type: String, enum: GENRE_LIST }],
  releaseDate: Date,
  director: String,
  actors: [String]
}, { timestamps: true })


export default model<Movie>('Movie', MovieSchema)
