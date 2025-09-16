// gateway/codegen.ts
import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "../contracts/graphql/**/*.graphql",
  generates: {
    "src/__generated__/types.ts": {
      plugins: ["typescript", "typescript-resolvers"],
      config: {
        contextType: "../context#GraphQLContext",
        avoidOptionals: false,
        enumsAsTypes: true,
        useTypeImports: true,
        makeResolverTypeCallable: true,
      },
    },
  },
};

export default config;
