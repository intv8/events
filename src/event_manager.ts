/**
 * This file exports the EventManager class and related features.
 *
 * @copyright 2022 integereleven. All rights reserved. MIT license.
 */

import { AbstractDisposable } from '../deps.ts';
import { Events } from './_internals/mod.ts';
import { EventEmitter } from './event_emitter.ts';

import type { EventHandler, TEventRegistry } from './types/mod.ts';

/**
 * Manages adding and removing of events.
 *
 * TODO: Implement EventManager class and update documentation.
 */
export class EventManager<T extends Record<string, EventHandler>>
  extends AbstractDisposable {
  protected events: Events<T> = new Events();

  protected stateOfEvents: TEventRegistry<T> = new Map();

  protected emitter = new EventEmitter<T>();

  protected stateOfEmitter = false;

  constructor(initialEvents: TEventRegistry<T> = new Map()) {
    super();

    const { events, emitter } = this;
    const observer = emitter.peekObserver();

    observer.subscribe(events);

    for (const [event, handlers] of initialEvents) {
      for (const handler of handlers) {
        this.addEventHandler(event, handler);
      }
    }
  }

  public getEventEmitter(): EventEmitter<T> {
    const { emitter, stateOfEmitter } = this;

    if (stateOfEmitter) {
      return new EventEmitter();
    }

    return emitter;
  }

  public addEventHandler<K extends keyof T>(event: K, handler: T[K]): void {
    const { stateOfEvents, events } = this;

    if (!stateOfEvents.has(event)) {
      stateOfEvents.set(event, []);
    }

    const handlers = stateOfEvents.get(event);
    if (!handlers) return;

    handlers.push(handler);

    if (handlers.length === 1) {
      const emitter = (...args: Parameters<T[K]>) => {
        handlers.forEach((handler) => handler(...args));
      };

      events.notify({ action: 'add', event, emitter: emitter as T[K] });
    }
  }

  public removeEventHandler<K extends keyof T>(event: K, handler: T[K]): void {
    const { stateOfEvents, events } = this;

    if (!stateOfEvents.has(event)) return;

    const handlers = stateOfEvents.get(event);
    if (!handlers) return;

    const index = handlers.indexOf(handler);
    if (index === -1) return;

    handlers.splice(index, 1);

    if (!handlers.length) {
      events.notify({ action: 'remove', event });
    }
  }

  public removeAllEventHandlers<K extends keyof T>(event: K): void {
    const { stateOfEvents, events } = this;

    if (!stateOfEvents.has(event)) return;

    const handlers = stateOfEvents.get(event);
    if (!handlers) return;

    stateOfEvents.set(event, []);

    events.notify({ action: 'remove', event });
  }

  public clear(): void {
    for (const [event] of this.stateOfEvents) {
      this.removeAllEventHandlers(event);
    }
  }

  public get isDisposed(): boolean {
    return this.events.isDisposed && this.emitter.isDisposed &&
      [...this.stateOfEvents.keys()].length === 0;
  }

  protected onDispose(): void {
    const { stateOfEvents, emitter, events } = this;

    for (const [event] of stateOfEvents) {
      events.notify({ action: 'remove', event });
    }

    stateOfEvents.clear();
    emitter.dispose();
  }
}
