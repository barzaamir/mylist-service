import { Schema, model } from 'mongoose'
import { CONTENT_TYPES } from '../types/contentType'

export interface MyListItem {
  userId: string
  contentId: string
  contentType: typeof CONTENT_TYPES[number]
  createdAt?: Date
  updatedAt?: Date
}

const MyListItemSchema = new Schema<MyListItem>({
  userId: { type: String, required: true, index: true },
  contentId: { type: String, required: true },
  contentType: { type: String, enum: CONTENT_TYPES, required: true }
}, { timestamps: true })

MyListItemSchema.index(
  { userId: 1, contentId: 1, contentType: 1 }, 
  { unique: true }
)

export default model<MyListItem>('MyListItem', MyListItemSchema)
