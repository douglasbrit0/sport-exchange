import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  // use the live gateway schema
  schema: ["../contracts/graphql/schema.graphql"],
  // scan your TS/TSX files for gql`` documents
  documents: "src/**/*.{ts,tsx,graphql}",
  generates: {
    "src/__generated__/gql.ts": {
      plugins: [
        "typescript",
        "typescript-operations",
        "typescript-urql"
      ],
      config: { useTypeImports: true }
    }
  }
};
export default config;
