const request = require('supertest');
const mongoose = require('mongoose');

beforeAll(async () => {
	await mongoose.connect(process.env.DATABASE_URL);
});

afterAll(async () => {
	await mongoose.disconnect();
});

const app = require('../app');

describe('GET /subscribers', () => {
	test('returns code 200 and an array', async () => {
		const res = await request(app).get('/subscribers');

		expect(res.statusCode).toBe(200);
		expect(Array.isArray(res.body)).toBe(true);
	});
});

describe('GET /subscribers/:id', () => {
	test('returns code 404 for non-existing subscriber', async () => {
		const fakeId = new mongoose.Types.ObjectId();

		const res = await request(app).get(`/subscribers/${fakeId}`);

		expect(res.statusCode).toBe(404);
		expect(res.body).toHaveProperty('message');
	});
});

describe('GET /subscribers/:id - FAILURE CASE', () => {
	test('returns code 404 for non-existing subscriber', async () => {
		const fakeId = new mongoose.Types.ObjectId();

		const res = await request(app).get(`/subscribers/${fakeId}`);

		expect(res.statusCode).toBe(404);
		expect(res.body).toHaveProperty('message');
	});
});

describe('POST /subscribers, GET/subscribers/:id, and DELETE /subscribers/:id', () => {
	test('create, get and delete a subscriber', async () => {
		const create = await request(app)
			.post('/subscribers')
			.send({
				name: 'Test User',
				subscribedToChannel: 'Test Channel'
			});

		expect(create.statusCode).toBe(201);
		expect(create.body).toHaveProperty('_id');

		const createdSubscriberId = create.body._id;

		const get = await request(app).get(`/subscribers/${createdSubscriberId}`);

		expect(get.statusCode).toBe(200);
		expect(get.headers['content-type']).toMatch(/json/);
		expect(get.body).toHaveProperty('_id');
		expect(get.body).toHaveProperty('name');
		expect(get.body).toHaveProperty('subscribedToChannel');

		const patch = await request(app).patch(`/subscribers/${createdSubscriberId}`)
			.send({
				name: 'Modified subscriber',
				subscribedToChannel: 'Modified channel'
			});
		
		expect(patch.statusCode).toBe(200);
		expect(patch.headers['content-type']).toMatch(/json/);
		expect(patch.body).toHaveProperty('_id');
		expect(patch.body).toHaveProperty('name');
		expect(patch.body).toHaveProperty('subscribedToChannel');

		const res = await request(app).delete(`/subscribers/${createdSubscriberId}`);

		expect(res.statusCode).toBe(200);
		expect(res.body).toHaveProperty('message');
	});
});

describe('POST /subscribers - FAILURE CASE', () => {
	test('returns code 400 and error message', async () => {
		const create = await request(app)
			.post('/subscribers')
			.send({
				name: 'Test user'
			});
		
		expect(create.statusCode).toBe(400);
		expect(create.body).toHaveProperty('message');
	});
});

describe('PATCH /subscribers/:id - FAILURE CASE', () => {
	test('returns code 404 and error message', async () => {
		const fakeId = new mongoose.Types.ObjectId();

		const res = await request(app).patch(`/subscribers/${fakeId}`)
			.send({
				name: 'Modified subscriber',
				subscribedToChannel: 'Modified channel'
			});

		expect(res.statusCode).toBe(404);
		expect(res.body).toHaveProperty('message');
	});
});