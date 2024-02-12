/**
 * This file contains tests for the EventManager feature.
 *
 * @copyright 2022 integereleven. All rights reserved. MIT license.
 */

import { assert, assertSpyCalls, describe, it, spy } from '../dev_deps.ts';

import { EventManager, IEvents } from './fixtures/events.fixtures.ts';

describe('EventManager', () => {
  it('should allow adding of event handlers', () => {
    const spyObserver = spy(console, 'log');
    const em = new EventManager<IEvents>();
    const handler = (name: string, age: number) => {
      console.log(`Added ${name} at age ${age}`);
    };

    em.addEventHandler('add', handler);

    const emitter = em.getEventEmitter();

    emitter.emit('add', 'John', 25);
    emitter.emit('add', 'Jane', 22);

    assertSpyCalls(spyObserver, 2);
    spyObserver.restore();
  });

  it('should allow removing of event handlers', () => {
    const spyObserver = spy(console, 'log');
    const em = new EventManager<IEvents>();
    const handler = (name: string, age: number) => {
      console.log(`Added ${name} at age ${age}`);
    };

    em.addEventHandler('add', handler);

    const emitter = em.getEventEmitter();

    emitter.emit('add', 'John', 25);
    emitter.emit('add', 'Jane', 22);

    em.removeEventHandler('add', handler);

    emitter.emit('add', 'Jane', 22);

    assertSpyCalls(spyObserver, 2);
    spyObserver.restore();
  });

  it('should allow removing of all event handlers', () => {
    const spyObserver = spy(console, 'log');
    const em = new EventManager<IEvents>();
    const handler1 = (name: string, age: number) => {
      console.log(`Added ${name} at age ${age}`);
    };
    const handler2 = (name: string, age: number) => {
      console.log(`Added ${name} at age ${age}`);
    };

    em.addEventHandler('add', handler1);
    em.addEventHandler('add', handler2);

    const emitter = em.getEventEmitter();

    emitter.emit('add', 'John', 25);
    emitter.emit('add', 'Jane', 22);

    em.removeAllEventHandlers('add');

    emitter.emit('add', 'Jane', 22);

    assertSpyCalls(spyObserver, 4);
    spyObserver.restore();
  });

  it('should allow clearing of all handlers for all events', () => {
    const spyObserver = spy(console, 'log');
    const em = new EventManager<IEvents>();

    const handler1 = (name: string, age: number) => {
      console.log(`Added ${name} at age ${age}`);
    };

    const handler2 = (name: string, age: number) => {
      console.log(`Added ${name} at age ${age}`);
    };

    const handler3 = (name: string) => {
      console.log(`removed ${name}`);
    };

    const handler4 = (name: string) => {
      console.log(`removed ${name}`);
    };

    em.addEventHandler('add', handler1);
    em.addEventHandler('add', handler2);
    em.addEventHandler('remove', handler3);
    em.addEventHandler('remove', handler4);

    const emitter = em.getEventEmitter();

    emitter.emit('add', 'John', 25);
    emitter.emit('add', 'Jane', 22);
    emitter.emit('remove', 'John');
    emitter.emit('remove', 'Jane');

    em.clear();

    emitter.emit('add', 'Jane', 22);
    emitter.emit('remove', 'Jane');

    assertSpyCalls(spyObserver, 8);
    spyObserver.restore();
  });

  it('should allow disposing of the event manager', () => {
    const spyObserver = spy(console, 'log');
    const em = new EventManager<IEvents>();

    const handler1 = (name: string, age: number) => {
      console.log(`Added ${name} at age ${age}`);
    };

    const handler2 = (name: string, age: number) => {
      console.log(`Added ${name} at age ${age}`);
    };

    const handler3 = (name: string) => {
      console.log(`removed ${name}`);
    };

    const handler4 = (name: string) => {
      console.log(`removed ${name}`);
    };

    em.addEventHandler('add', handler1);
    em.addEventHandler('add', handler2);
    em.addEventHandler('remove', handler3);
    em.addEventHandler('remove', handler4);

    const emitter = em.getEventEmitter();

    emitter.emit('add', 'John', 25);
    emitter.emit('add', 'Jane', 22);
    emitter.emit('remove', 'John');
    emitter.emit('remove', 'Jane');

    em.dispose();

    assert(em.isDisposed);
    assert(emitter.isDisposed);

    em.addEventHandler('add', handler1);
    em.addEventHandler('add', handler2);

    emitter.emit('add', 'Jane', 22);
    emitter.emit('remove', 'Jane');

    assertSpyCalls(spyObserver, 8);
    spyObserver.restore();
  });

  it('should accept initial handlers', () => {
    const spyObserver = spy(console, 'log');
    const handler1 = (name: string, age: number) => {
      console.log(`Added ${name} at age ${age}`);
    };

    const handler2 = (name: string, age: number) => {
      console.log(`Added ${name} at age ${age}`);
    };

    const handler3 = (name: string) => {
      console.log(`removed ${name}`);
    };

    const handler4 = (name: string) => {
      console.log(`removed ${name}`);
    };

    const em = new EventManager<IEvents>(
      new Map([
        ['add', [handler1, handler2]],
        ['remove', [handler3, handler4]],
      ]),
    );

    const emitter = em.getEventEmitter();

    emitter.emit('add', 'John', 25);
    emitter.emit('add', 'Jane', 22);
    emitter.emit('remove', 'John');
    emitter.emit('remove', 'Jane');

    em.dispose();

    assert(em.isDisposed);
    assert(emitter.isDisposed);

    em.addEventHandler('add', handler1);
    em.addEventHandler('add', handler2);

    emitter.emit('add', 'Jane', 22);
    emitter.emit('remove', 'Jane');

    assertSpyCalls(spyObserver, 8);
    spyObserver.restore();
  });
});
