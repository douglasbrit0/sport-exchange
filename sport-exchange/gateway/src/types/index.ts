// === Plan: Use generated proto types, add a thin mapper, deprecate local mirrors ===
// Repo-aware paths based on your tree. This keeps imports stable via a barrel.

// File: gateway/src/types/index.ts (barrel re-export)
// Purpose: single import point for generated engine/ledger types.
export * as enginev1 from "../__generated__/proto/engine/v1/quote_pb.js";
export * as ledgerv1  from "../__generated__/proto/ledger/v1/event_pb.js";

// File: gateway/tsconfig.json (paths excerpt — keep your existing options, add these if missing)
// {
//   "compilerOptions": {
//     "baseUrl": "./src",
//     "paths": {
//       "@/*": ["./*"],
//       "@/types": ["./types/index"],
//       "@/mappers/*": ["./mappers/*"],
//       "@/routes/*": ["./routes/*"],
//       "@/clients/*": ["./clients/*"]
//     }
//   }
// }

// File: contracts/proto/engine/v1/quote.proto (shape reference only; ensure it matches your actual)
// syntax = "proto3";
// package engine.v1;
// option go_package = "github.com/yourorg/sport-exchange/contracts/gen/go/engine/v1;enginev1";
// message Quote {
//   string symbol = 1;
//   double last_price = 2;
//   double bid_price = 3;
//   double ask_price = 4;
//   int64  as_of_ms   = 5;
//   string source     = 6;
// }

// File: infra/local/docker-compose.yml (excerpt — ensure env is set and dependency order)
// services:
//   price-svc:
//     build: { context: ./price-svc }
//     ports: ["8080:8080"]
//   gateway:
//     build: { context: ., dockerfile: gateway/Dockerfile }
//     environment:
//       - PRICE_SVC_URL=http://price-svc:8080
//     ports: ["4000:4000"]
//     depends_on:
//       - price-svc
