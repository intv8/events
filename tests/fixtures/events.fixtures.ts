/**
 * This file contains test cases, mocks, or other data for testing the
 * EventManager feature.
 *
 * For use in ../event_manager.test.ts.
 *
 * @copyright 2022 integereleven. All rights reserved. MIT license.
 */

import { EventManager } from '../../mod.ts';

export { EventManager };
export type IEvents = {
  'add': (name: string, age: number) => void;
  'remove': (name: string) => void;
};
