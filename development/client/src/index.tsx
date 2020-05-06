import { InMemoryCache, NormalizedCacheObject } from "apollo-cache-inmemory";
import ApolloClient from "apollo-client";
import { HttpLink } from "apollo-link-http";
import gql from "graphql-tag";
import React, { FC } from "react";
import ReactDOM from "react-dom";

import { ApolloProvider, useQuery } from "@apollo/react-hooks";

import Pages from "./pages";
import Login from "./pages/login";
import { resolvers, typeDefs } from "./resolvers";
import injectStyles from "./styles";

const cache = new InMemoryCache();
const link = new HttpLink({
  uri: "http://localhost:4000/",
  headers: {
    authorization: localStorage.getItem("token"),
  },
});

const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
  cache,
  link,
  typeDefs,
  resolvers,
});

cache.writeData({
  data: {
    isLoggedIn: !!localStorage.getItem("token"),
    cartItems: [],
  },
});

const IS_LOGGED_IN = gql`
  query IsUserLoggedIn {
    isLoggedIn @client
  }
`;

const IsLoggedIn: FC = () => {
  const { data } = useQuery(IS_LOGGED_IN);

  return data.isLoggedIn ? <Pages /> : <Login />;
};

injectStyles();
ReactDOM.render(
  <ApolloProvider client={client}>
    <IsLoggedIn />
  </ApolloProvider>,
  document.getElementById("root")
);
