import dotenv from "dotenv";
import { ApolloServer, gql } from 'apollo-server';
import { ApolloGateway, RemoteGraphQLDataSource } from '@apollo/gateway';
dotenv.config();

// Set port number
const { PORT = 4000 } = process.env;

class AuthenticatedDataSource extends RemoteGraphQLDataSource {
  willSendRequest({ request, context }) {
    // pass the coinmarketcap api key from the context to underlying services
    // as a header called `x-cmc-key`
    const { authKey } = context;
    if(authKey) {
      request.http.headers.set('x-auth-key', authKey);
    }
  }
}

(async () => {
  // Initialize an ApolloGateway instance and pass it an array of
  // your implementing service names and URLs
  const gateway = new ApolloGateway({
    buildService({ name, url }) {
      return new AuthenticatedDataSource({ url });
    },
    serviceList: [
      { name: 'users-api', url: 'http://localhost:5001' },
      { name: 'wallets-api', url: 'http://localhost:5002' },
      { name: 'cryptocurrency-api', url: 'http://localhost:5003' },
    ],
  });

  // Pass the ApolloGateway to the ApolloServer constructor
  const server = new ApolloServer({
    gateway,
    context: async ({ req }) => {
      const authKey = 'encrypted secret key to decrypt';  
      // Add auth key to context
      return { 
        authKey,
      };
     },
    // Disable subscriptions (not currently supported with ApolloGateway)
    subscriptions: false,
  });

  server.listen({ port: PORT}).then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
  });
})();