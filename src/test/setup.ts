import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { MongoDBClient } from 'config/db';

let mongoClient: MongoDBClient;

// beforeAll(async () => {
//   const getClient = await MongoDBClient.getInstance();
//   console.log({ getClient });
//   if (!getClient) {
//     throw new Error('Failed to get MongoDBClient instance');
//   }
//   mongoClient = getClient;
// }, 10000);

// afterAll(async () => {
//   try {
//     await mongoClient.close();
//   } catch (err) {
//     console.log('Could not close MongoDBClient instance');
//   }
// }, 10000);

// beforeAll(async () => {
//   // Start the in-memory MongoDB server with replica set enabled
//   mongo = await MongoMemoryServer.create({
//     instance: {
//       replSet: 'rs0', // Specify the replica set name (e.g., "rs0")
//       storageEngine: 'wiredTiger', // Specify the storage engine if needed
//     },
//   });

//   const uri = mongo.getUri();

//   if (mongoose.connection.readyState === 0) {
//     await mongoose.connect(uri, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//   }
// }, 20000);

// afterAll(async () => {
//   await mongoose.connection.close();
//   await mongo.stop();
// }, 20000);
