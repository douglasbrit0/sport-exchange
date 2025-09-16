import { createClient, cacheExchange, fetchExchange } from "urql";

const url: string = import.meta.env.VITE_GRAPHQL_URL ?? "/graphql";

export const client = createClient({
  url,
  requestPolicy: "cache-and-network",
  // ensure queries use POST (not GET)
  preferGetMethod: false,
  // add headers that trigger a CORS preflight and satisfy Apollo's CSRF check
  fetchOptions: () => ({
    headers: {
      "content-type": "application/json",
      "apollo-require-preflight": "true",
      // or you could use: "x-apollo-operation-name": "browser"
    },
    // include if you plan to send cookies; safe to omit otherwise
    // credentials: "include",
  }),
  exchanges: [cacheExchange, fetchExchange],
});
