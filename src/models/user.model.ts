import { Schema, model } from 'mongoose'
import { GENRE_LIST } from '../types/genres'

export interface WatchHistoryItem {
  contentId: string
  watchedOn?: Date
  rating?: number
}

export interface UserPreferences {
  favoriteGenres: string[]
  dislikedGenres: string[]
}

export interface User {
  id: string
  username: string
  preferences: UserPreferences
  watchHistory: WatchHistoryItem[]
  createdAt?: Date
  updatedAt?: Date
}

const WatchHistorySchema = new Schema<WatchHistoryItem>({
  contentId: String,
  watchedOn: Date,
  rating: Number
}, { _id: false })

const PreferencesSchema = new Schema<UserPreferences>({
  favoriteGenres: [{ type: String, enum: GENRE_LIST }],
  dislikedGenres: [{ type: String, enum: GENRE_LIST }],
}, { _id: false })

const UserSchema = new Schema<User>({
  id: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  preferences: PreferencesSchema,
  watchHistory: [WatchHistorySchema]
}, { timestamps: true })

export default model<User>('User', UserSchema)
