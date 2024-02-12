/**
 * This file contains tests for the EventEmitter feature.
 *
 * @copyright 2022 integereleven. All rights reserved. MIT license.
 */

import { assert, assertEquals, describe, it } from '../dev_deps.ts';

import { EventManager, IEvents } from './fixtures/events.fixtures.ts';

describe('EventEmitter', () => {
  it('should return unattached observer after initial peer', () => {
    const em = new EventManager<IEvents>();

    const emitter = em.getEventEmitter();
    const observer = emitter.peekObserver();
    assertEquals(observer.identifier, '');
  });

  it('should dispose of the EventManager when disposed itself', () => {
    const em = new EventManager<IEvents>();

    const emitter = em.getEventEmitter();

    emitter.dispose();

    assert(emitter.isDisposed);
    assert(em.isDisposed);
  });
});
