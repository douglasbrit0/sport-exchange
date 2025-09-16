// @ts-nocheck
import type { Express } from "express";
import { PriceSvcClient } from "@/clients/priceSvc";
import { enginev1 } from "@/types";
import { toJson } from "@bufbuild/protobuf";

export async function registerGraphQL(app: Express, priceClient: PriceSvcClient) {
  // Opaque dynamic imports: TS won't try to resolve these subpaths
  const { ApolloServer } = await (eval("import")("@apollo/server") as Promise<any>);
  const { expressMiddleware } = await (eval("import")("@apollo/server/express4") as Promise<any>);
  const { ApolloServerPluginLandingPageLocalDefault } = await (eval("import")("@apollo/server/plugin/landingPage/default") as Promise<any>);

  const typeDefs = /* GraphQL */`
    type Quote {
      playerId: String!
      bid: Float!
      ask: Float!
      mid: Float!
      tsMs: Float!
      reqId: String!
    }
    type Query {
      quote(playerId: String!): Quote!
    }
  `;

  const resolvers = {
    Query: {
      quote: async (_: unknown, args: { playerId: string }) => {
        const msg = await priceClient.getQuote(args.playerId);
        const json: any = toJson(enginev1.QuoteResponseSchema, msg);
        if (typeof json.tsMs === "string") json.tsMs = Number(json.tsMs);
        return json;
      },
    },
  };

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginLandingPageLocalDefault()],
  });
  await server.start();

  app.use("/graphql", (await import("express")).json(), expressMiddleware(server));
}