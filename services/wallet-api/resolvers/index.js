//import wallets data
import { wallets } from '../models';

//Define resolvers
export default {
  Query: {
    getWallets: async (parent) => {
      return wallets;
    },
    getWalletById: async (parent, { walletId }) => {
      const walletById = wallets.find((wallet) => wallet.walletId === walletId);
      return walletById;
    }
  },
  Wallet: {
    // Our wallet contains the User entity extended from the User service
    // To resolve user data, we send a wallet ID reference to find the owner of the wallet
    user(reference) {
      //'reference' contains wallet information including the wallet ID
      const { walletId } = reference;
      return { __typename: "User", walletId: walletId };
    },
    //Reference resolver - used by services querying user data
    //Resolver for 'user' queries by wallet ID
    __resolveReference(reference) {
      const { walletId } = reference;
      const walletById = wallets.find((wallet) => wallet.walletId === walletId);
      return walletById;
    }
  },
  User: {
    wallet: (user) => {
      const walletById = wallets.find((wallet) => wallet.walletId === user.walletId);
      return walletById;
    }
  }
};