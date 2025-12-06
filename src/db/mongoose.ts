import mongoose from 'mongoose'

export async function connectMongoose(uri: string) {
  mongoose.set('strictQuery', true)
  return mongoose.connect(uri)
}
