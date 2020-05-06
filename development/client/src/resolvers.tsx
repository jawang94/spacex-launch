import { ApolloCache } from "apollo-cache";
import { Resolvers } from "apollo-client";
import gql from "graphql-tag";

import * as GetCartItemTypes from "./pages/__generated__/GetCartItems";
import * as LaunchTileTypes from "./pages/__generated__/LaunchTile";
import { GET_CART_ITEMS } from "./pages/cart";

export const typeDefs = gql`
  extend type Query {
    isLoggedIn: Boolean!
    cartItems: [ID!]!
  }

  extend type Launch {
    isInCart: Boolean!
  }

  extend type Mutation {
    addOrRemoveFromCart(id: ID): [ID!]!
  }
`;

type ResolverFn = (
  parent: any,
  args: any,
  { cache }: { cache: ApolloCache<any> }
) => any;

interface ResolverMap {
  [field: string]: ResolverFn;
}

interface AppResolvers extends Resolvers {
  Launch: ResolverMap;
}

export const resolvers: AppResolvers = {
  Launch: {
    isInCart: (launch: LaunchTileTypes.LaunchTile, _, { cache }): boolean => {
      const queryResult = cache.readQuery<GetCartItemTypes.GetCartItems>({
        query: GET_CART_ITEMS,
      });

      if (queryResult) {
        return queryResult.cartItems.includes(launch.id);
      }

      return false;
    },
  },
};
