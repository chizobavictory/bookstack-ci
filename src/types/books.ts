import { IUser } from "./user";

export interface IBook extends Document {
  title: string;
  author: string;
  description: string;
  publishedYear: number;
  genre: string;
  userId?: IUser['_id'];
  createdA?: Date;
  updatedAt?: Date;
}