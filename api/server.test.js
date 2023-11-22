// Write your tests here
const request = require("supertest");
const db = require("../data/dbConfig.js");
const server = require("./server.js");

test("sanity", () => {
  expect(true).toBe(true);
});

beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
});

beforeEach(async () => {
  await db("users").truncate();
});

afterAll(async () => {
  await db.destroy();
});

describe("[POST] /api/auth/register", () => {
  it("responds with 201 on successful register", async () => {
    await request(server)
      .post("/api/auth/register")
      .send({ username: "test", password: "test" });
    const users = await db("users");
    expect(users).toHaveLength(1);
  });
  it("responds with 400 on missing username or password", async () => {
    const res = await request(server)
      .post("/api/auth/register")
      .send({ username: "test" });
    expect(res.status).toBe(400);
  });
  it("responds with 400 on username taken", async () => {
    await request(server)
      .post("/api/auth/register")
      .send({ username: "test", password: "test" });
    const res = await request(server)
      .post("/api/auth/register")
      .send({ username: "test", password: "test" });
    expect(res.status).toBe(400);
  });
});

describe("[POST] /api/auth/login", () => {
  it("responds with 200 on successful login", async () => {
    await request(server)
      .post("/api/auth/register")
      .send({ username: "test", password: "test" });
    const res = await request(server)
      .post("/api/auth/login")
      .send({ username: "test", password: "test" });
    expect(res.status).toBe(200);
  });
  it("responds with 401 on invalid credentials", async () => {
    await request(server)
      .post("/api/auth/register")
      .send({ username: "test", password: "test" });
    const res = await request(server)
      .post("/api/auth/login")
      .send({ username: "test", password: "test1" });
    expect(res.status).toBe(401);
  });
  it("responds with 400 on missing username or password", async () => {
    const res = await request(server)
      .post("/api/auth/login")
      .send({ username: "test" });
    expect(res.status).toBe(400);
  });
});

describe("[GET] /api/jokes", () => {
  it("responds with 200 on successful get", async () => {
    await request(server)
      .post("/api/auth/register")
      .send({ username: "test", password: "test" });
    const res = await request(server)
      .post("/api/auth/login")
      .send({ username: "test", password: "test" });
    const jokes = await request(server)
      .get("/api/jokes")
      .set("Authorization", res.body.token);
    expect(jokes.status).toBe(200);
  });
  it("responds with 401 on invalid credentials", async () => {
    await request(server)
      .post("/api/auth/register")
      .send({ username: "test", password: "test" });
    const res = await request(server)
      .post("/api/auth/login")
      .send({ username: "test", password: "test" });
    const jokes = await request(server)
      .get("/api/jokes")
      .set("Authorization", "test");
    expect(jokes.status).toBe(401);
  });
  it("responds with 401 on missing token", async () => {
    await request(server)
      .post("/api/auth/register")
      .send({ username: "test", password: "test" });
    const res = await request(server)
      .post("/api/auth/login")
      .send({ username: "test", password: "test" });
    const jokes = await request(server).get("/api/jokes");
    expect(jokes.status).toBe(401);
  });
});
