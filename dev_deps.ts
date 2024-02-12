/**
 * This file re-exports external development dependencies used by the intv8
 * events package.
 *
 * @copyright 2022 integereleven. All rights reserved. MIT license.
 */

export { describe, it } from 'https://deno.land/std@0.213.0/testing/bdd.ts';

export {
  assertSpyCalls,
  spy,
  stub,
} from 'https://deno.land/std@0.213.0/testing/mock.ts';

export {
  assert,
  assertEquals,
} from 'https://deno.land/std@0.213.0/assert/mod.ts';
