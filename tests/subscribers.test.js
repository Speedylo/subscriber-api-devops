const request = require('supertest');
const app = require('../app');
const mongoose = require("mongoose");

afterAll(async () => {
  await mongoose.connection.close();
});

test('Testing getting all users', async () => {
    const res = await request(app).get("/subscribers");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
});