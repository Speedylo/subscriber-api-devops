const request = require('supertest');
const mongoose = require("mongoose");

beforeAll(async () => {
  await mongoose.connect(process.env.DATABASE_URL);
});

afterAll(async () => {
  await mongoose.disconnect();
});

const app = require('../app');

describe("GET /subscribers", () => {
    test('returns code 200 and an array', async () => {
        const res = await request(app).get("/subscribers");

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });
});

describe("GET /subscribers/:id", () => {
    test("returns code 404 for non-existing subscriber", async () => {
        const fakeId = new mongoose.Types.ObjectId();

        const res = await request(app).get(`/subscribers/${fakeId}`);

        expect(res.statusCode).toBe(404);
        expect(res.body).toHaveProperty("message")
    });
});

describe("POST /subscribers and DELETE /subscribers/:id", () => {
    test("create and delete a subscriber", async () => {
        const create = await request(app)
                    .post("/subscribers")
                    .send({
                        name: "Test User",
                        subscribedToChannel: "Test Channel"
                    });

        expect(create.statusCode).toBe(201);
        expect(create.body).toHaveProperty("_id");

        const createdSubscriberId = create.body._id;

        const res = await request(app).delete(`/subscribers/${createdSubscriberId}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("message");
    });
});

describe("PATCH /subscribers/:id", () => {
    test("fail to modify inexistent subscriber", async () => {
        const fakeId = new mongoose.Types.ObjectId();

        const res = await request(app).patch(`/subscribers/${fakeId}`)
                                      .send({
                                        name: "Modified subscriber",
                                        subscribedToChannel: "Modified channel"
                                      });

        expect(res.statusCode).toBe(404);
        expect(res.body).toHaveProperty("message");
    })
})