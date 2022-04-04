import {
  ApolloClient,
  InMemoryCache,
  ApolloLink,
  concat,
  HttpLink
} from "@apollo/client"

import { getVisitorToken, getUserAccessToken } from "../utils/cookie"

const authMiddleware = new ApolloLink((operation, forward) => {
  operation.setContext(({ headers = {} }) => {
    return {
      headers: {
        ...headers,
        apikey: process.env.GRAPHQL_APIKEY,
        "x_api_token": getUserAccessToken() || getVisitorToken()
      }
    }
  })

  return forward(operation);
})

const httpLink = new HttpLink({ uri: process.env.GRAPHQL_URI })

export const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: concat(authMiddleware, httpLink),
})