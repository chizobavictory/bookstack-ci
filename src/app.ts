import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import authRoutes from './routes/auth.routes';
import bookRoutes from './routes/book.routes';
import cors from 'cors';
import { MongoDBClient } from './config/db';  

const app = express();
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('API is running...');
});

if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 3003;
  MongoDBClient.getInstance().then(client => {
    if (client) {
      client.connect().then(() => {
        app.listen(PORT, () => {
          console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
        });
      }).catch(err => {
        console.error("Error connecting to MongoDB:", err);
        process.exit(1);
      });
    } else {
      console.error("MongoDB client instance not available.");
      process.exit(1);
    }
  });
}

app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);

export default app;
