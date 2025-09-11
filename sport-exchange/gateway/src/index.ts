// src/index.ts
import "dotenv/config";
import express from "express";
import cors from "cors";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { readFileSync } from "fs";
import path from "path";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { resolvers } from "./resolvers";
import type { GraphQLContext } from "./context";

// IMPORTANT: schema is in ../contracts from the gateway folder
const schemaPath = path.resolve(process.cwd(), "../contracts/graphql/schema.graphql");
const typeDefs = readFileSync(schemaPath, "utf8");

const server = new ApolloServer<GraphQLContext>({ typeDefs, resolvers });

async function main() {
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use(morgan("tiny"));
  app.use(rateLimit({ windowMs: 60_000, max: 600 }));

  await server.start();

  app.get("/healthz", (_req, res) => res.status(200).send("ok"));

  // Tiny debug endpoint to confirm wiring at runtime
  app.get("/_debug", (_req, res) => {
    res.json({
      schemaPath,
      queryResolvers: Object.keys((resolvers as any).Query || {}),
    });
  });

  app.use(
    "/graphql",
    expressMiddleware(server, {
      context: async () => ({ requestId: crypto.randomUUID?.() }),
    })
  );

  const PORT = Number(process.env.PORT ?? 4000);
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`gateway listening on http://0.0.0.0:${PORT}`);
    console.log(`SDL: ${schemaPath}`);
    console.log(`Query resolvers: ${Object.keys((resolvers as any).Query || {}).join(", ")}`);
  });
}

main().catch((e) => {
  console.error("fatal startup error:", e);
  process.exit(1);
});
