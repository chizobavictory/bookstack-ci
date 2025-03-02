import request from 'supertest';
import app from '../app';
import { mongoUserService } from '../service/mongo';
import { mongoose, MongoMemoryReplSet } from '../config/db';
import { StatusCode } from 'types/response';

let replSet: MongoMemoryReplSet;

beforeAll(async () => {
  replSet = await MongoMemoryReplSet.create({
    replSet: { storageEngine: 'wiredTiger' },
  });
  const uri = replSet.getUri();

  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(uri);
  }

  const db = mongoose.connection.db;
  if (!db) {
    throw new Error('Database connection not established');
  }

  const collections = await db.listCollections().toArray();
  if (!collections.find((col) => col.name === 'users')) {
    await db.createCollection('users');
  }

  await mongoUserService.deleteMany({});
}, 50000);

afterAll(async () => {
  await mongoose.connection.close();
  await replSet.stop();
});

describe('Authentication flow (Register then Login)', () => {
  let registeredUserEmail = 'new@gmail.com';
  let userName = 'newuser';
  const userPassword = 'password123';

  it('should register a new user with valid data', async () => {
    const res = await request(app).post('/api/auth/register').send({
      username: userName,
      email: registeredUserEmail,
      password: userPassword,
    });
    console.log('/REGISTER', res.body.message);

    expect(res.status).toBe(StatusCode.CREATED);
    expect(res.body.message).toBe('User registered successfully!');
    expect(res.body.data.profile.email).toBe(registeredUserEmail);
    expect(res.body.data.profile).toHaveProperty('userId');
    expect(res.body.data.profile).toHaveProperty('token');
  });

  it('should return an error when trying to register an already existing user', async () => {
    const res = await request(app).post('/api/auth/register').send({
      username: 'martins',
      email: registeredUserEmail,
      password: 'password123',
    });
    console.log('/EXISTINGUSER', res.body.message);

    expect(res.status).toBe(StatusCode.ALREADY_EXISTS);
    expect(res.body.message).toBe('User already exists');
  });

  it('should login the registered user', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: registeredUserEmail,
      password: userPassword,
    });
    console.log('/LOGIN', res.body.message);

    expect(res.status).toBe(StatusCode.OK);
    expect(res.body.message).toBe('Login successful');
    expect(res.body.data.profile.email).toBe(registeredUserEmail);
    expect(res.body.data.profile).toHaveProperty('userId');
    expect(res.body.data).toHaveProperty('token');
    expect(res.body.data).toHaveProperty('PUBLIC_KEY');
  });

  it('should return an error when the password is invalid', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: registeredUserEmail,
      password: 'wrongPassword',
    });
    console.log('/INVALIDPASSWORD', res.body.message);

    expect(res.status).toBe(StatusCode.UNAUTHORIZED);
    expect(res.body.message).toBe('Invalid password');
  });

  it('should return error when email does not exist during login', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'nonexistent@example.com',
      password: 'anyPassword',
    });
    console.log('/LOGIN-NONEXISTENT', res.body.message);

    expect(res.status).toBe(StatusCode.UNAUTHORIZED);
    expect(res.body.message).toBe('Email does not exist');
  });

  it('should return server error when exception occurs during registration', async () => {
    const fakeSession = {
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      abortTransaction: jest.fn(),
      inTransaction: () => true,
      endSession: jest.fn(),
    };

    const sessionSpy = jest.spyOn(mongoUserService, 'startSession').mockResolvedValue(fakeSession as any);

    const findOneSpy = jest.spyOn(mongoUserService, 'findOne').mockImplementation(() => {
      throw new Error('Test registration error');
    });

    const res = await request(app).post('/api/auth/register').send({
      username: 'erroruser',
      email: 'error@example.com',
      password: 'password123',
    });
    console.log('/REGISTRATION-ERROR', res.body.message);

    expect(res.status).toBe(StatusCode.INTERNAL_SERVER_ERROR);
    expect(res.body.message).toBe('Server error');

    findOneSpy.mockRestore();
    sessionSpy.mockRestore();
  });

  it('should return error when user creation fails during registration', async () => {
    const fakeSession = {
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      abortTransaction: jest.fn(),
      inTransaction: () => true,
      endSession: jest.fn(),
    };

    const sessionSpy = jest.spyOn(mongoUserService, 'startSession').mockResolvedValue(fakeSession as any);

    const createSpy = jest.spyOn(mongoUserService, 'create').mockResolvedValue({
      status: false,
      data: null,
      message: 'Creation failed',
    });

    const res = await request(app).post('/api/auth/register').send({
      username: 'failuser',
      email: 'fail@example.com',
      password: 'password123',
    });
    console.log('/CREATION-FAIL', res.body.message);

    expect(res.status).toBe(StatusCode.BAD_REQUEST);
    expect(res.body.message).toBe('Failed to create user');

    createSpy.mockRestore();
    sessionSpy.mockRestore();
  });

  it('should return server error when exception occurs during login', async () => {
    const findOneSpy = jest.spyOn(mongoUserService, 'findOne').mockImplementation(() => {
      throw new Error('Test login error');
    });

    const res = await request(app).post('/api/auth/login').send({
      email: 'nonexistent@example.com',
      password: 'password123',
    });
    console.log('/LOGIN-ERROR', res.body.message);

    expect(res.status).toBe(StatusCode.INTERNAL_SERVER_ERROR);
    expect(res.body.message).toBe('Server error');

    findOneSpy.mockRestore();
  });
});
