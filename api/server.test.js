// Write your tests here
const request = require('supertest');
const db = require('../data/db-config');
const server = require("./server.js");
const Joke = require('./jokesModel.js')

test('sanity', () => {
  expect(true).toBe(true)
})

const joke1 = {joke: "why did the chicken cross the road?", punchline: "Because it was free range"}
const joke2 = {joke: "why did the chicken cross the road?", punchline: "To avoid this lame joke"}

beforeAll(async () => {
   await db.migrate.rollback()
   await db.migrate.latest()
})

beforeEach(async () => {
 await db("jokes").truncate()
})

afterAll(async () => {
 await db.destroy()
})
