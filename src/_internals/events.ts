/**
 * This file exports the internal Events class and related features.
 *
 * @copyright 2022 integereleven. All rights reserved. MIT license.
 */

import { EventObserver } from './event_observer.ts';

import type { IDisposable, TObservable, TObserver } from '../../deps.ts';
import type {
  EventHandler,
  EventNotification,
  TEventRegistry,
} from '../types/mod.ts';

class EventUnsubscriber<T extends Record<string, EventHandler>>
  implements IDisposable {
  #observers: TObserver<EventNotification<T>>[];

  #observer: TObserver<EventNotification<T>>;

  constructor(
    observers: TObserver<EventNotification<T>>[],
    observer: TObserver<EventNotification<T>>,
  ) {
    this.#observers = observers;
    this.#observer = observer;
  }

  get isDisposed(): boolean {
    return !this.#observers.length;
  }

  public dispose(): void {
    const index = this.#observers.indexOf(this.#observer);

    if (index !== -1) {
      this.#observers.splice(index, 1);
    }
  }
}

/** Observable collection of events used by the {@link EventManager} to update the {@link EventEmitter}. */
export class Events<T extends Record<string, EventHandler>>
  implements TObservable<EventNotification<T>> {
  protected stateOfEvents: TEventRegistry<T>;

  protected stateOfObservers: EventObserver<T>[] = [];

  constructor(initialEvents: TEventRegistry<T> = new Map()) {
    this.stateOfEvents = initialEvents;
  }

  public get isDisposed(): boolean {
    return !this.stateOfObservers.length;
  }

  public subscribe(observer: EventObserver<T>): IDisposable {
    this.stateOfObservers.push(observer);

    return new EventUnsubscriber(this.stateOfObservers, observer);
  }

  public notify(notification: EventNotification<T>): void {
    for (const observer of this.stateOfObservers) {
      observer.next(notification);
    }
  }

  public addEventHandler<K extends keyof T>(event: K, handler: T[K]): void {
    const { stateOfEvents } = this;

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

      this.notify({ event, emitter: emitter as T[K], action: 'add' });
    }
  }

  public removeEventHandler<K extends keyof T>(event: K, handler: T[K]): void {
    const { stateOfEvents } = this;

    if (!stateOfEvents.has(event)) return;

    const handlers = stateOfEvents.get(event);
    if (!handlers) return;

    const index = handlers.indexOf(handler);
    if (index === -1) return;

    handlers.splice(index, 1);

    if (handlers.length === 0) {
      this.notify({ event, action: 'remove' });
    }
  }
}
