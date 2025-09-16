// graphql-depth-limit
declare module "graphql-depth-limit" {
  import { ValidationRule } from "graphql";
  const depthLimit: (maxDepth: number, options?: Record<string, unknown>) => ValidationRule;
  export default depthLimit;
}

// graphql-validation-complexity
declare module "graphql-validation-complexity" {
  import { ValidationRule } from "graphql";
  export function createComplexityLimitRule(
    maxComplexity: number,
    options?: Record<string, unknown>
  ): ValidationRule;
}
