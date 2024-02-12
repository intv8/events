/**
 * This file exports the internal EventObserver class and related features.
 *
 * @copyright 2022 integereleven. All rights reserved. MIT license.
 */

import { Events } from './events.ts';

import type { IDisposable, TObserver } from '../../deps.ts';
import type { EventHandler, EventNotification } from '../types/mod.ts';

/** Observes `Events` and updates the `EventEmitter`. */
export class EventObserver<T extends Record<string, EventHandler>>
  implements TObserver<EventNotification<T>> {
  #events: Map<keyof T, T[keyof T]> = new Map();
  #unsubscriber?: IDisposable;
  #identifier: string;

  constructor(identifier: string) {
    this.#identifier = identifier;
  }

  public next(value: EventNotification<T>): void {
    if (value.action === 'add') {
      this.#events.set(value.event, value.emitter);
    } else {
      this.#events.delete(value.event);
    }
  }

  public error(error: Error): void {
    //  throw a new Exception
    console.log(`EventObserver ${this.#identifier} error: `, error);
  }

  public complete(): void {
    this.#events.clear();
  }

  public unsubscribe(): void {
    this.complete();
    this.#unsubscriber?.dispose();
  }

  public getEmitterFor<K extends keyof T>(event: K): T[K] | undefined {
    return this.#events.get(event) as T[K];
  }

  public subscribe(observer: Events<T>): void {
    this.#unsubscriber = observer.subscribe(this);
  }

  public get identifier(): string {
    return this.#identifier;
  }
}
