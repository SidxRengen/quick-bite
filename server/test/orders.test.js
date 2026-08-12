import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { createApp } from '../src/app.js';
import { MenuItem } from '../src/models/MenuItem.js';
import { Order } from '../src/models/Order.js';
import { env } from '../src/config/env.js';

const app = createApp();
const itemData = { name: 'Test Pizza', description: 'Fresh and hot test pizza', price: 250, image: 'https://example.com/pizza.jpg', category: 'Pizza' };
const customer = { address: '12 Computing Lane', phone: '+91 9876543210' };
const savedCustomer = { name: 'Ada Lovelace', ...customer };
const credentials = { name: 'Ada Lovelace', email: 'ada@example.com', password: 'securepass123' };
const withToken = (requestBuilder, token) => requestBuilder.set('Authorization', `Bearer ${token}`);
const register = async (overrides = {}) => request(app).post('/api/auth/register').send({ ...credentials, ...overrides });
const restaurantLogin = async () => request(app).post('/api/restaurant/login').send({ accessKey: env.restaurantAccessKey });

describe('health API', () => {
  it('reports API and database health', async () => {
    const response = await request(app).get('/api/health');
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ status: 'ok', service: 'quickbite-api', database: 'connected' });
    expect(response.body.uptimeSeconds).toEqual(expect.any(Number));
    expect(response.body.timestamp).toEqual(expect.any(String));
  });
});

describe('authentication API', () => {
  it('registers a user, returns a token, and never exposes a password hash', async () => {
    const response = await register();
    expect(response.status).toBe(201);
    expect(response.body.token).toEqual(expect.any(String));
    expect(response.body.user).toMatchObject({ name: credentials.name, email: credentials.email });
    expect(response.body.user.passwordHash).toBeUndefined();
    expect((await register()).status).toBe(409);
  });

  it('logs in, reads the current user, and rejects invalid credentials', async () => {
    await register();
    const login = await request(app).post('/api/auth/login').send({ email: credentials.email, password: credentials.password });
    expect(login.status).toBe(200);
    const me = await withToken(request(app).get('/api/auth/me'), login.body.token);
    expect(me.body.user.email).toBe(credentials.email);
    expect((await request(app).post('/api/auth/login').send({ email: credentials.email, password: 'wrongpass' })).status).toBe(401);
    expect((await request(app).get('/api/auth/me')).status).toBe(401);
  });

  it('validates registration fields', async () => {
    const response = await register({ name: '', email: 'bad', password: 'short' });
    expect(response.status).toBe(400);
    expect(response.body.details).toMatchObject({ name: expect.any(String), email: expect.any(String), password: expect.any(String) });
  });
});

describe('menu API', () => {
  it('lists only available items without authentication', async () => {
    await MenuItem.create([itemData, { ...itemData, name: 'Hidden', available: false }]);
    const response = await request(app).get('/api/menu');
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
  });

  it('supports restaurant menu create, list, edit, hide and delete operations', async () => {
    const restaurantToken = (await restaurantLogin()).body.token;
    const created = await withToken(request(app).post('/api/menu'), restaurantToken).send(itemData);
    expect(created.status).toBe(201);
    expect(created.body.name).toBe(itemData.name);

    const id = created.body._id;
    const updated = await withToken(request(app).patch(`/api/menu/${id}`), restaurantToken).send({ price: 275, available: false });
    expect(updated.status).toBe(200);
    expect(updated.body).toMatchObject({ price: 275, available: false });
    expect((await request(app).get('/api/menu')).body).toHaveLength(0);
    expect((await withToken(request(app).get('/api/menu/admin'), restaurantToken)).body).toHaveLength(1);
    expect((await withToken(request(app).delete(`/api/menu/${id}`), restaurantToken)).status).toBe(204);
    expect((await withToken(request(app).get('/api/menu/admin'), restaurantToken)).body).toHaveLength(0);
  });

  it('protects and validates restaurant menu operations', async () => {
    expect((await request(app).post('/api/menu').send(itemData)).status).toBe(401);
    expect((await request(app).get('/api/menu/admin')).status).toBe(401);
    const restaurantToken = (await restaurantLogin()).body.token;
    const response = await withToken(request(app).post('/api/menu'), restaurantToken).send({ name: '', description: '', price: -1, image: 'bad', category: '' });
    expect(response.status).toBe(400);
    expect(response.body.details).toMatchObject({ name: expect.any(String), description: expect.any(String), price: expect.any(String), image: expect.any(String), category: expect.any(String) });
    expect((await withToken(request(app).patch('/api/menu/not-an-id'), restaurantToken).send({ available: false })).status).toBe(400);
  });
});

describe('authenticated order CRUD and validation', () => {
  it('requires authentication', async () => {
    expect((await request(app).get('/api/orders')).status).toBe(401);
    expect((await request(app).post('/api/orders').send({})).status).toBe(401);
  });

  it('creates, reads, lists, updates and deletes a cancelled order', async () => {
    const token = (await register()).body.token;
    const item = await MenuItem.create(itemData);
    const created = await withToken(request(app).post('/api/orders'), token).send({ customer, items: [{ menuItemId: item.id, quantity: 2 }] });
    expect(created.status).toBe(201); expect(created.body.total).toBe(500); expect(created.body.status).toBe('Order Received');
    expect(created.body.customer).toMatchObject(savedCustomer);
    const id = created.body._id;
    expect((await withToken(request(app).get(`/api/orders/${id}`), token)).status).toBe(200);
    expect((await withToken(request(app).get('/api/orders'), token)).body).toHaveLength(1);
    const updated = await withToken(request(app).patch(`/api/orders/${id}/status`), token).send({ status: 'Cancelled' });
    expect(updated.body.status).toBe('Cancelled');
    expect((await withToken(request(app).delete(`/api/orders/${id}`), token)).status).toBe(204);
    expect(await Order.countDocuments()).toBe(0);
  });

  it('prevents one user from reading another user’s order', async () => {
    const firstToken = (await register()).body.token;
    const secondToken = (await register({ email: 'grace@example.com' })).body.token;
    const item = await MenuItem.create(itemData);
    const order = await withToken(request(app).post('/api/orders'), firstToken).send({ customer, items: [{ menuItemId: item.id, quantity: 1 }] });
    expect((await withToken(request(app).get(`/api/orders/${order.body._id}`), secondToken)).status).toBe(404);
    expect((await withToken(request(app).get('/api/orders'), secondToken)).body).toHaveLength(0);
  });

  it('rejects empty orders and invalid customer details', async () => {
    const token = (await register()).body.token;
    const response = await withToken(request(app).post('/api/orders'), token).send({ customer: { address: '', phone: 'abc' }, items: [] });
    expect(response.status).toBe(400);
  });

  it('rejects unavailable items and ignores client-supplied prices', async () => {
    const token = (await register()).body.token;
    const item = await MenuItem.create(itemData);
    const response = await withToken(request(app).post('/api/orders'), token).send({ customer: { ...customer, name: 'Spoofed Name' }, items: [{ menuItemId: item.id, quantity: 2, price: 1 }] });
    expect(response.body.total).toBe(500);
    expect(response.body.customer.name).toBe(credentials.name);
    item.available = false; await item.save();
    expect((await withToken(request(app).post('/api/orders'), token).send({ customer, items: [{ menuItemId: item.id, quantity: 1 }] })).status).toBe(400);
  });

  it('allows customers to cancel only before preparation starts', async () => {
    const token = (await register()).body.token;
    expect((await withToken(request(app).get('/api/orders/not-an-id'), token)).status).toBe(400);
    const item = await MenuItem.create(itemData);
    const created = await withToken(request(app).post('/api/orders'), token).send({ customer, items: [{ menuItemId: item.id, quantity: 1 }] });
    const id = created.body._id;
    expect((await withToken(request(app).patch(`/api/orders/${id}/status`), token).send({ status: 'Preparing' })).status).toBe(403);
    const restaurantToken = (await restaurantLogin()).body.token;
    await withToken(request(app).patch(`/api/restaurant/orders/${id}/status`), restaurantToken).send({ status: 'Preparing' });
    expect((await withToken(request(app).patch(`/api/orders/${id}/status`), token).send({ status: 'Cancelled' })).status).toBe(409);
  });
});

describe('restaurant order workflow', () => {
  it('requires the private restaurant access key and restaurant JWT', async () => {
    expect((await request(app).get('/api/restaurant/orders')).status).toBe(401);
    expect((await request(app).post('/api/restaurant/login').send({ accessKey: 'wrong' })).status).toBe(401);
    const login = await restaurantLogin();
    expect(login.status).toBe(200);
    expect(login.body.token).toEqual(expect.any(String));
  });

  it('lists placed orders with customer details and advances statuses sequentially', async () => {
    const token = (await register()).body.token;
    const restaurantToken = (await restaurantLogin()).body.token;
    const item = await MenuItem.create(itemData);
    const created = await withToken(request(app).post('/api/orders'), token).send({ customer, items: [{ menuItemId: item.id, quantity: 2 }] });
    const id = created.body._id;

    const list = await withToken(request(app).get('/api/restaurant/orders'), restaurantToken);
    expect(list.status).toBe(200);
    expect(list.body[0]).toMatchObject({ status: 'Order Received', total: 500, customer: savedCustomer });
    expect(list.body[0].user).toMatchObject({ name: credentials.name, email: credentials.email });

    expect((await withToken(request(app).patch(`/api/restaurant/orders/${id}/status`), restaurantToken).send({ status: 'Out for Delivery' })).status).toBe(409);
    expect((await withToken(request(app).patch(`/api/restaurant/orders/${id}/status`), restaurantToken).send({ status: 'Preparing' })).body.status).toBe('Preparing');
    expect((await withToken(request(app).patch(`/api/restaurant/orders/${id}/status`), restaurantToken).send({ status: 'Out for Delivery' })).body.status).toBe('Out for Delivery');
    expect((await withToken(request(app).patch(`/api/restaurant/orders/${id}/status`), restaurantToken).send({ status: 'Delivered' })).body.status).toBe('Delivered');
    expect((await withToken(request(app).patch(`/api/restaurant/orders/${id}/status`), restaurantToken).send({ status: 'Preparing' })).status).toBe(409);
  });

  it('validates restaurant status values and order ids', async () => {
    const restaurantToken = (await restaurantLogin()).body.token;
    expect((await withToken(request(app).patch('/api/restaurant/orders/not-an-id/status'), restaurantToken).send({ status: 'Preparing' })).status).toBe(400);
    const missingId = '507f1f77bcf86cd799439011';
    expect((await withToken(request(app).patch(`/api/restaurant/orders/${missingId}/status`), restaurantToken).send({ status: 'Preparing' })).status).toBe(404);
  });
});
