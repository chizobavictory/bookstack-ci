import express from 'express';
import { authMiddleware } from '../middleware/auth';
import { BookController } from '../controllers/books.controller';

const router = express.Router();

router.post('/create-book', authMiddleware.authenticate.bind(authMiddleware), BookController.createBook);

router.get('/get-books', authMiddleware.authenticate.bind(authMiddleware), BookController.getBooks);

router.get('/get-book/:id', authMiddleware.authenticate.bind(authMiddleware), BookController.getBook);

router.put('/update-book/:id', authMiddleware.authenticate.bind(authMiddleware), BookController.updateBook);

router.delete('/delete-book/:id', authMiddleware.authenticate.bind(authMiddleware), BookController.deleteBook);

export default router;
