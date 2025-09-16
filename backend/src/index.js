import dotenv from 'dotenv';
dotenv.config();

import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { MongoClient, ServerApiVersion } from 'mongodb';

const { DB_URI, DB_NAME, DB_USER } = process.env;

// Validate environment variables
if (!DB_URI) {
  console.error('DB_URI environment variable is not defined');
  process.exit(1);
}


const books = [
  {
    title: 'The Awakening',
    author: 'Kate Chopin',
  },
  {
    title: 'City of Glass',
    author: 'Paul Auster',
  },
];

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(DB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});


async function run() {
  try {
    // Connect the client to the server
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (error) {
    console.error('MongoDB connection failed:', error);
  }
  // Don't close the connection here if you want to keep it open for GraphQL operations
}

const typeDefs = `#graphql
  type Book {
    title: String
    author: String
  }

  type Query {
    books: [Book]
  }
`;

const resolvers = {
  Query: {
    books: () => books,
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Initialize database connection and start server
async function startServer() {
  
  
  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
  });
  
  console.log(`🚀 Server ready at: ${url}`);

  await run();
}

startServer().catch(console.error);
