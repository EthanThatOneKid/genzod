import { GenerateProps } from "./deps.ts";
import { generate } from "./deps.ts";

export type GenOpts = GenerateProps;

export interface Generated {
  transformedSourceText: string;
  zodSchemasFile: string;
  errors: string[];
  hasCircularDependencies: boolean;
}

export function gen(o: GenOpts): Generated {
  const {
    transformedSourceText,
    getZodSchemasFile,
    errors,
    hasCircularDependencies,
  } = generate(o);
  return {
    transformedSourceText,
    zodSchemasFile: getZodSchemasFile(""),
    errors,
    hasCircularDependencies,
  };
}
