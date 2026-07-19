import { DECORATORS_BY_NAME, RESOLVERS_BY_NAME } from './intellisense-catalog';

export type HoverContent = {
  kind: 'decorator' | 'resolver';
  name: string;
  summary: string;
  documentation: string;
};

/** Resolve hover content for a word like `@internal` or `ifs`. */
export function resolveHoverContent(hoveredText: string): HoverContent | undefined {
  if (hoveredText.startsWith('@')) {
    const decorator = DECORATORS_BY_NAME[hoveredText.slice(1)];
    if (!decorator) return undefined;
    return {
      kind: 'decorator',
      name: decorator.name,
      summary: decorator.summary,
      documentation: decorator.documentation,
    };
  }

  const resolver = RESOLVERS_BY_NAME[hoveredText];
  if (!resolver) return undefined;
  return {
    kind: 'resolver',
    name: resolver.name,
    summary: resolver.summary,
    documentation: resolver.documentation,
  };
}
