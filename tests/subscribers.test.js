const request = require('supertest');
const mongoose = require('mongoose');
const Subscriber = require('../models/subscriber'); 

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

describe('GET /subscribers - SERVER ERROR', () => {
	test('returns code 500 when database fails', async () => {
		// Force find() to throw an error
		const spy = jest.spyOn(Subscriber, 'find').mockImplementation(() => {
			throw new Error('Database Failure');
		});

		const res = await request(app).get('/subscribers');

		expect(res.statusCode).toBe(500);
		expect(res.body.message).toBe('Database Failure');

		spy.mockRestore();
	});
});


describe('Middleware getSubscriber - DATABASE ERROR', () => {
	test('returns code 500 if findById throws an error', async () => {
		const spy = jest.spyOn(Subscriber, 'findById').mockImplementation(() => {
			throw new Error('Critical DB Error');
		});

		const res = await request(app).get('/subscribers/any-id');

		expect(res.statusCode).toBe(500);
		expect(res.body.message).toBe('Critical DB Error');

		spy.mockRestore();
	});
});

describe('PATCH & DELETE - INSTANCE ERRORS', () => {
	test('PATCH /subscribers/:id returns 400 if save fails', async () => {
		// 1. Create a real sub so the middleware passes
		const sub = await Subscriber.create({ name: 'Test', subscribedToChannel: 'Test' });

		// 2. Mock the Prototype save to fail
		const spy = jest.spyOn(Subscriber.prototype, 'save').mockImplementation(() => {
			throw new Error('Validation/Save Error');
		});

		const res = await request(app)
			.patch(`/subscribers/${sub._id}`)
			.send({ name: 'New Name' });

		expect(res.statusCode).toBe(400);
		expect(res.body.message).toBe('Validation/Save Error');
		spy.mockRestore();
	});

	test('DELETE /subscribers/:id returns 500 if deleteOne fails', async () => {
		const sub = await Subscriber.create({ name: 'Test', subscribedToChannel: 'Test' });

		// Mock the Prototype deleteOne to fail
		const spy = jest.spyOn(Subscriber.prototype, 'deleteOne').mockImplementation(() => {
			throw new Error('Delete Operation Failed');
		});

		const res = await request(app).delete(`/subscribers/${sub._id}`);

		expect(res.statusCode).toBe(500);
		expect(res.body.message).toBe('Delete Operation Failed');
		spy.mockRestore();
	});
});

describe('PATCH /subscribers/:id - Branch Completion', () => {
	test('skips update when fields are null', async () => {
		// 1. Create a subscriber
		const sub = await Subscriber.create({ 
			name: 'Stay The Same', 
			subscribedToChannel: 'Stay The Same' 
		});

		// 2. Send null values
		// This makes (req.body.name !== null) evaluate to FALSE
		const res = await request(app)
			.patch(`/subscribers/${sub._id}`)
			.send({ 
				name: null, 
				subscribedToChannel: null 
			});

		expect(res.statusCode).toBe(200);
		expect(res.body.name).toBe('Stay The Same');
		expect(res.body.subscribedToChannel).toBe('Stay The Same');
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