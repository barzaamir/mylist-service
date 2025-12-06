# MyList Service

This project implements the “My List” feature for an OTT platform. Users can add Movies or TV Shows to their personal list, remove them, and retrieve their saved items with pagination.
The backend is built using Node.js, TypeScript, Express, MongoDB, Redis, and includes integration tests.

## Setup Instructions

### 1. Install dependencies
npm ci

### 2. Configure environment variables
Copy .env

Example:
PORT=4000  
MONGODB_URI=mongodb://localhost:27017/mylistdb  
REDIS_URL=redis://localhost:6379  
CACHE_TTL_SECONDS=300   

### 3. Start MongoDB & Redis

brew install mongodb-community@7.0  
brew install redis  
brew services start mongodb-community@7.0  
brew services start redis  

### 4. Seed sample data
npm run seed

Creates:
- A test user
- Sample movies
- Sample TV shows

### 5. Start the application
npm run dev

Server runs at:
http://localhost:4000

---

## Running Tests

Integration tests use:
- mongodb-memory-server (in-memory MongoDB)
- ioredis-mock (mock Redis)

Run:
npm test

No local MongoDB/Redis needed for testing.

---

## API Endpoints

### Add to My List
POST /my-list  
Body: { "contentId": "mov-1", "contentType": "Movie" }

### Remove from My List
DELETE /my-list/:contentId?contentType=Movie

### List My Items
GET /my-list?page=1&limit=20  
Returns: items, pagination metadata, ok flag, message

---

## Design Choices

### 1. Redis Caching for Sub-10ms Reads
The "my-list" endpoint is called frequently.
To achieve high performance:
- Fully enriched My List cached under mylist:{userId}
- Pagination done via array slicing in memory

### 2. Cache Invalidation on Writes
Adding or removing an item invalidates the user’s cache:
invalidateUserListCache(userId)
Ensures consistency between DB and Redis.

### 3. Batched Content Fetching
To enrich list items:
- Movie IDs fetched in one batch
- TVShow IDs fetched in one batch
- Joined using in-memory maps
Avoids N+1 queries and improves scalability.

### 4. Proper Indexing
MyListItem includes:
- Unique index: (userId, contentId, contentType)

### 5. Clean Architecture
The system uses layered design:
- Controllers
- Validators
- Services
- Cache layer
- Models
- Integration tests

Improves maintainability and testability.

---

## Assumptions

1. Authentication is handled outside this service; simulated using x-user-id.
2. My List is read-heavy; caching is essential.
3. Database schemas follow assignment specifications.
4. Local MongoDB and Redis for development.

---

## Summary

This service provides:
- Fast, cache-first read operations
- Clean and scalable architecture
- Strong validation and error handling
- Full integration test coverage
- Easy reproducibility using seed scripts

## Future Improvements

This implementation meets all functional and non-functional requirements for the My List feature. However, with additional time, the solution could be enhanced further. Some areas of potential improvement include:
- More advanced caching strategy (e.g., smarter TTL policies, or per-user batching)
- More comprehensive test coverage, including unit tests for services, validators, and middleware
- Pagination optimisations using MongoDB aggregation pipelines
- Better error abstraction and API response standardisation

Note: Given more time for the assignment, these enhancements would be implemented to further increase scalability, robustness, and production-readiness.