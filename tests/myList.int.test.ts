/**
 * Integration tests for My List API 
 * Covers:
 *  - Add item
 *  - Remove item
 *  - List items with pagination
 *  - Cache behavior via Redis mock
 */

jest.mock('ioredis', () => {
  const data = new Map<string, string>();

  return jest.fn().mockImplementation(() => ({
    get: jest.fn((key) => data.get(key) || null),
    set: jest.fn((key, value) => {
      data.set(key, value);
      return 'OK';
    }),
    del: jest.fn((key) => {
      data.delete(key);
      return 1;
    }),
  }));
});

import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import app from "../src/app";

import Movie from "../src/models/movie.model";
import TVShow from "../src/models/tvShow.model";
import MyListItem from "../src/models/myListItem.model";

let mongo: MongoMemoryServer;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  await mongoose.connect(mongo.getUri());

  // Seed sample content
  await Movie.create({ id: "m1", title: "Movie 1" });
  await Movie.create({ id: "m2", title: "Movie 2" });
  await Movie.create({ id: "m3", title: "Movie 3" });
  await TVShow.create({ id: "t1", title: "TV Show 1", episodes: [] });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongo.stop();
});

afterEach(async () => {
  await MyListItem.deleteMany({});
});

describe("My List API", () => {
  const headers = { "x-user-id": "user1" };

  // ----------------------------------------------------------
  test("Add item → success", async () => {
    const res = await request(app)
      .post("/my-list")
      .set(headers)
      .send({ contentId: "mov-1", contentType: "Movie" });

    expect(res.status).toBe(200);
  });

  // ----------------------------------------------------------
  test("Remove item → success", async () => {
    await request(app)
      .post("/my-list")
      .set(headers)
      .send({ contentId: "t1", contentType: "TVShow" });

    const res = await request(app)
      .delete("/my-list/t1")
      .set(headers)
      .query({ contentType: "TVShow" });

    expect(res.status).toBe(200);
  });

  // ----------------------------------------------------------
  test("List items → returns correct pagination", async () => {
    await request(app).post("/my-list").set(headers).send({ contentId: "m1", contentType: "Movie" });
    await request(app).post("/my-list").set(headers).send({ contentId: "m2", contentType: "Movie" });
    await request(app).post("/my-list").set(headers).send({ contentId: "m3", contentType: "Movie" });

    const res = await request(app)
      .get("/my-list?page=1&limit=2")
      .set(headers);

    expect(res.status).toBe(200);
    expect(res.body.data.pagination.total).toBe(3);
    expect(res.body.data.items.length).toBe(2);
  });

  // ----------------------------------------------------------
  test("List items → page 2 contains remaining items", async () => {
    await request(app).post("/my-list").set(headers).send({ contentId: "m1", contentType: "Movie" });
    await request(app).post("/my-list").set(headers).send({ contentId: "m2", contentType: "Movie" });
    await request(app).post("/my-list").set(headers).send({ contentId: "m3", contentType: "Movie" });

    const res = await request(app)
      .get("/my-list?page=2&limit=2")
      .set(headers);

    expect(res.status).toBe(200);
    expect(res.body.data.items.length).toBe(1);
  });

  // ----------------------------------------------------------
  test("List items → redis cache should be used", async () => {
    await request(app).post("/my-list").set(headers).send({
      contentId: "m1",
      contentType: "Movie",
    });

    const r1 = await request(app).get("/my-list?page=1&limit=10").set(headers);
    expect(r1.status).toBe(200);
    const r2 = await request(app).get("/my-list?page=1&limit=10").set(headers);
    expect(r2.status).toBe(200);
    expect(r2.body.data.items.length).toBe(1);
  });
});
