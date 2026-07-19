import { describe, expect, it } from 'vitest';

import {
  BUILTIN_VAR_KEYS,
  DECORATORS_BY_NAME,
  ITEM_DECORATORS,
  RESOLVERS,
  ROOT_DECORATORS,
} from '../src/intellisense-catalog';

/**
 * Expected built-in names mirrored from varlock runtime registries.
 * Keep in sync with:
 * - packages/varlock/src/env-graph/lib/decorators.ts (builtInRootDecorators / builtInItemDecorators)
 * - packages/varlock/src/env-graph/lib/type-generation/code-generators.ts (builtInCodeGenerators)
 * - packages/varlock/src/env-graph/lib/resolver.ts (BaseResolvers)
 * - packages/varlock/src/env-graph/lib/builtin-vars.ts (BUILTIN_VARS)
 *
 * Test-only item decorator `warn` is intentionally omitted.
 */
const RUNTIME_ROOT_DECORATORS = [
  'envFlag',
  'currentEnv',
  'defaultRequired',
  'defaultSensitive',
  'disable',
  'import',
  'plugin',
  'cache',
  'redactLogs',
  'preventLeaks',
  'encryptInjectedEnv',
  'disableProcessEnvInjection',
  'auditIgnorePaths',
  'setValuesBulk',
  // code generators (registered via builtInCodeGenerators, not builtInRootDecorators)
  'generateTsTypes',
  'generatePythonEnv',
  'generateRustEnv',
  'generateGoEnv',
  'generatePhpEnv',
  'generateTypes',
] as const;

const RUNTIME_ITEM_DECORATORS = [
  'required',
  'optional',
  'sensitive',
  'public',
  'internal',
  'type',
  'example',
  'docsUrl',
  'docs',
  'icon',
  'deprecated',
  'auditIgnore',
] as const;

const RUNTIME_RESOLVERS = [
  'concat',
  'fallback',
  'ref',
  'exec',
  'randomNum',
  'randomUuid',
  'randomHex',
  'randomString',
  'cache',
  'remap',
  'ifs',
  'forEnv',
  'eq',
  'if',
  'not',
  'isEmpty',
  'regex',
  'inferFromPrefix',
] as const;

const RUNTIME_BUILTIN_VARS = [
  'VARLOCK_ENV',
  'VARLOCK_IS_CI',
  'VARLOCK_BRANCH',
  'VARLOCK_PR_NUMBER',
  'VARLOCK_COMMIT_SHA',
  'VARLOCK_COMMIT_SHA_SHORT',
  'VARLOCK_PLATFORM',
  'VARLOCK_BUILD_URL',
  'VARLOCK_REPO',
] as const;

function catalogNames(entries: Array<{ name: string }>) {
  return new Set(entries.map((entry) => entry.name));
}

function expectSuperset(actual: Set<string>, expected: ReadonlyArray<string>, label: string) {
  const missing = expected.filter((name) => !actual.has(name)).sort();
  expect(missing, `${label} missing from catalog: ${missing.join(', ')}`).toEqual([]);
}

describe('intellisense-catalog parity with runtime built-ins', () => {
  it('includes every public built-in root decorator and code generator', () => {
    expectSuperset(catalogNames(ROOT_DECORATORS), RUNTIME_ROOT_DECORATORS, 'root decorators');
  });

  it('includes every public built-in item decorator', () => {
    expectSuperset(catalogNames(ITEM_DECORATORS), RUNTIME_ITEM_DECORATORS, 'item decorators');
  });

  it('includes every built-in user-facing resolver', () => {
    expectSuperset(catalogNames(RESOLVERS), RUNTIME_RESOLVERS, 'resolvers');
  });

  it('includes every built-in VARLOCK_* key', () => {
    expectSuperset(new Set(BUILTIN_VAR_KEYS), RUNTIME_BUILTIN_VARS, 'builtin vars');
  });

  it('exposes the high-risk built-ins called out in #469', () => {
    expect(DECORATORS_BY_NAME.internal).toBeDefined();
    expect(DECORATORS_BY_NAME.deprecated).toBeDefined();
    expect(DECORATORS_BY_NAME.cache).toBeDefined();
    expect(DECORATORS_BY_NAME.encryptInjectedEnv).toBeDefined();
    expect(DECORATORS_BY_NAME.disableProcessEnvInjection).toBeDefined();
    expect(RESOLVERS.some((resolver) => resolver.name === 'ifs')).toBe(true);
  });

  it('documents critical named args for import / setValuesBulk / generateTsTypes', () => {
    const importDec = DECORATORS_BY_NAME.import;
    expect(importDec.documentation).toMatch(/allowMissing/);
    expect(importDec.documentation).toMatch(/enabled/);
    expect(importDec.documentation).toMatch(/pick/);
    expect(importDec.insertText).toMatch(/allowMissing/);

    const bulk = DECORATORS_BY_NAME.setValuesBulk;
    expect(bulk.documentation).toMatch(/createMissing/);
    expect(bulk.documentation).toMatch(/format/);
    expect(bulk.documentation).toMatch(/enabled/);
    expect(bulk.insertText).toMatch(/createMissing/);

    const generateTs = DECORATORS_BY_NAME.generateTsTypes;
    expect(generateTs.documentation).toMatch(/auto/);
    expect(generateTs.documentation).toMatch(/executeWhenImported/);
    expect(generateTs.insertText).toMatch(/auto/);
    expect(generateTs.insertText).toMatch(/executeWhenImported/);
  });
});
