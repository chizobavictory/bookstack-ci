import { Request, Response } from 'express';
import { mongoBookService } from '../service/mongo';
import { ResponseUtils } from '../utils/reponse';
import { StatusCode } from '../types/response';
import { mongoose } from '../config/db';

class bookController {
  public async createBook(req: Request, res: Response): Promise<void> {
    const { title, author, description, publishedYear, genre } = req.body;

    try {
      const session = await mongoBookService.startSession();
      session.startTransaction();

      const _id = new mongoose.Types.ObjectId();

      const newBook = await mongoBookService.create(
        {
          _id,
          title,
          author,
          description,
          publishedYear,
          genre,
          userId: req.user?._id,
        },
        { session }
      );

      if (!newBook.status) {
        await mongoBookService.abortTransaction();
        return ResponseUtils.error(res, 'Failed to create book', StatusCode.BAD_REQUEST);
      }

      await mongoBookService.commitTransaction();
      return ResponseUtils.success(res, { book: newBook.data }, 'Book created successfully!', StatusCode.CREATED);
    } catch (error: any) {
      await mongoBookService.abortTransaction().catch(console.error);
      return ResponseUtils.error(res, 'Server error', StatusCode.INTERNAL_SERVER_ERROR, error.message || error);
    }
  }

  public async getBooks(req: Request, res: Response): Promise<void> {
    try {
      const books = await mongoBookService.find({ userId: req.user?._id });
      return ResponseUtils.success(res, { books: books.data }, 'Books fetched successfully', StatusCode.OK);
    } catch (error: any) {
      return ResponseUtils.error(res, 'Server error', StatusCode.INTERNAL_SERVER_ERROR, error.message || error);
    }
  }

  public async getBook(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    try {
      const book = await mongoBookService.findById(new mongoose.Types.ObjectId(id));
      if (!book.status || !book.data) {
        return ResponseUtils.error(res, 'Book not found', StatusCode.NOT_FOUND);
      }
      return ResponseUtils.success(res, { book: book.data }, 'Book fetched successfully', StatusCode.OK);
    } catch (error: any) {
      return ResponseUtils.error(res, 'Server error', StatusCode.INTERNAL_SERVER_ERROR, error.message || error);
    }
  }

  public async updateBook(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { title, author, description, publishedYear, genre } = req.body;

    try {
      const updatedBook = await mongoBookService.updateOne(
        { _id: new mongoose.Types.ObjectId(id), userId: req.user?._id },
        { title, author, description, publishedYear, genre }
      );

      if (!updatedBook.status) {
        return ResponseUtils.error(res, 'Failed to update book', StatusCode.BAD_REQUEST);
      }
      return ResponseUtils.success(res, { book: updatedBook.data }, 'Book updated successfully', StatusCode.OK);
    } catch (error: any) {
      return ResponseUtils.error(res, 'Server error', StatusCode.INTERNAL_SERVER_ERROR, error.message || error);
    }
  }

  public async deleteBook(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    try {
      const deletedBook = await mongoBookService.deleteOne({ _id: new mongoose.Types.ObjectId(id), userId: req.user?._id });

      if (!deletedBook.status) {
        return ResponseUtils.error(res, 'Failed to delete book', StatusCode.BAD_REQUEST);
      }
      return ResponseUtils.success(res, null, 'Book deleted successfully', StatusCode.OK);
    } catch (error: any) {
      return ResponseUtils.error(res, 'Server error', StatusCode.INTERNAL_SERVER_ERROR, error.message || error);
    }
  }
}

export const BookController = new bookController();
