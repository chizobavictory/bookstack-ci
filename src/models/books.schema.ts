import { DefaultDate } from 'types/user';
import { mongoose, Schema } from '../config/db';
import { IBook } from '../types/books';

export type BookDocument = IBook & mongoose.Document;

const BookSchema = new Schema<BookDocument>(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    description: { type: String, required: true },
    publishedYear: { type: Number, required: true },
    genre: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

BookSchema.set('toJSON', {
  transform: function (doc: mongoose.Document, ret: Partial<BookDocument & DefaultDate>) {
    if (ret.createdAt) {
      ret.createdAt = ret.createdAt.toISOString() as any;
    }
    if (ret.updatedAt) {
      ret.updatedAt = ret.updatedAt.toISOString() as any;
    }
    return ret;
  },
});

const BookModel = mongoose.model<BookDocument>('Book', BookSchema);

export { BookModel, BookSchema };
