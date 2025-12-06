/**
 * Seed script to add sample users, movies, tvshows
 */
import 'dotenv/config'
import mongoose from 'mongoose'
import User from '../models/user.model'
import Movie from '../models/movie.model'
import TVShow from '../models/tvShow.model'
import { connectMongoose } from '../db/mongoose'
import CONFIG from '../config'

const {MONGODB_URI = ''} = CONFIG

async function run() {
  await connectMongoose(MONGODB_URI)
  await User.deleteMany({})
  await Movie.deleteMany({})
  await TVShow.deleteMany({})
  await User.create({
    id: 'test-user',
    username: 'tester',
    preferences: { favoriteGenres: ['Drama', 'Comedy'], dislikedGenres: [] },
    watchHistory: []
  })
  const movies = [
    { id: 'mov-1', title: 'Action Movie', description: 'An action movie', genres: ['Action'], releaseDate: new Date(), director: 'A', actors: ['X'] },
    { id: 'mov-2', title: 'Drama Movie', description: 'A drama movie', genres: ['Drama'], releaseDate: new Date(), director: 'B', actors: ['Y'] }
  ]
  const tvs = [
    { id: 'tv-1', title: 'Sitcom', description: 'Funny show', genres: ['Comedy'], episodes: [] },
    { id: 'tv-2', title: 'SciFi Show', description: 'Space drama', genres: ['SciFi'], episodes: [] }
  ]
  await Movie.insertMany(movies)
  await TVShow.insertMany(tvs)
  console.log('Seeded sample data')
  await mongoose.disconnect()
}

run().catch(err => {
  console.error(err)
  process.exit(1)
})
