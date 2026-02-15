const request = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");

afterAll(async () => {
  await mongoose.connection.close();
});

test('Test health check', async () => {
    const res = await request(app).get("/health");
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ status: "ok" });
});