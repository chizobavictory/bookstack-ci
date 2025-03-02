import request from 'supertest';
import app from '../app';
import { mongoUserService } from '../service/mongo';
import { mongoBookService } from '../service/mongo';
import { mongoose, MongoMemoryReplSet } from '../config/db';
import { StatusCode } from 'types/response';

let replSet: MongoMemoryReplSet;
let token: string;
let userId: string;

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
  if (!collections.find((col) => col.name === 'books')) {
    await db.createCollection('books');
  }

  await mongoUserService.deleteMany({});
  await mongoBookService.deleteMany({});

  const registerRes = await request(app).post('/api/auth/register').send({
    username: 'testuser',
    email: 'testuser@example.com',
    password: 'password123',
  });
  console.log('/REGISTER', registerRes.body.message);
  expect(registerRes.status).toBe(StatusCode.CREATED);

  const loginRes = await request(app).post('/api/auth/login').send({
    email: 'testuser@example.com',
    password: 'password123',
  });
  console.log('/LOGIN', loginRes.body.message);
  expect(loginRes.status).toBe(StatusCode.OK);
  token = loginRes.body.data.profile.token;
  userId = loginRes.body.data.profile.userId;
}, 50000);

afterAll(async () => {
  await mongoose.connection.close();
  await replSet.stop();
});

describe('Book Endpoints with Auth', () => {
  const bookData = {
    title: 'Test Book',
    author: 'Test Author',
    description: 'A great test book',
    publishedYear: 2020,
    genre: 'Fiction',
    userId,
  };

  let bookId: string;

  describe('POST /api/books', () => {
    it('should create a new book with valid data', async () => {
      const res = await request(app).post('/api/books/create-book').set('Authorization', token).send(bookData);
      console.log('/CREATE-BOOK', res.body.message);

      expect(res.status).toBe(StatusCode.CREATED);
      expect(res.body.message).toBe('Book created successfully!');
      expect(res.body.data.book).toHaveProperty('_id');
      expect(res.body.data.book.title).toBe(bookData.title);

      bookId = res.body.data.book._id;
    });
  });

  describe('GET /api/books', () => {
    it('should fetch all books for the user', async () => {
      const res = await request(app).get('/api/books/get-books').set('Authorization', token);
      console.log('/GET-BOOKS', res.body.message);

      expect(res.status).toBe(StatusCode.OK);
      expect(res.body.message).toBe('Books fetched successfully');
      expect(Array.isArray(res.body.data.books)).toBe(true);
    });
  });

  describe('GET /api/books/:id', () => {
    it('should fetch the book by id', async () => {
      const res = await request(app).get(`/api/books/get-book/${bookId}`).set('Authorization', token);
      console.log('/GET-BOOK', res.body.message);

      expect(res.status).toBe(StatusCode.OK);
      expect(res.body.message).toBe('Book fetched successfully');
      expect(res.body.data.book).toHaveProperty('_id', bookId);
    });
  });

  describe('PATCH /api/books/:id', () => {
    it('should update the book successfully', async () => {
      const updatedData = {
        title: 'Updated Test Book',
        author: 'Updated Author',
        description: 'Updated Description',
        publishedYear: 2021,
        genre: 'Non-Fiction',
      };

      const res = await request(app).put(`/api/books/update-book/${bookId}`).set('Authorization', token).send(updatedData);
      console.log('/UPDATE-BOOK', res.body.message);

      expect(res.status).toBe(StatusCode.OK);
      expect(res.body.message).toBe('Book updated successfully');
      expect(res.body.data.book.title).toBe(updatedData.title);
    });
  });

  describe('DELETE /api/books/:id', () => {
    it('should delete the book successfully', async () => {
      const res = await request(app).delete(`/api/books/delete-book/${bookId}`).set('Authorization', token);
      console.log('/DELETE-BOOK', res.body.message);

      expect(res.status).toBe(StatusCode.OK);
      expect(res.body.message).toBe('Book deleted successfully');
    });
  });
});
