/**
 * This file exports the EventEmitter class and related features.
 *
 * @copyright 2022 integereleven. All rights reserved. MIT license.
 */

import { EventObserver } from './_internals/mod.ts';

import type { IDisposable } from '../deps.ts';
import type { EventHandler } from './types/mod.ts';

/**
 * Emits events for an `EventManager`.
 *
 * TODO: Implement EventEmitter class and update documentation.
 */
export class EventEmitter<T extends Record<string, EventHandler>>
  implements IDisposable {
  protected observer: EventObserver<T> = new EventObserver('EventEmitter');

  protected stateOfIsDisposed = false;

  protected stateOfObserverPeek = false;
  constructor() {}

  public peekObserver(): EventObserver<T> {
    if (this.stateOfObserverPeek) {
      return new EventObserver('');
    }

    this.stateOfObserverPeek = true;

    return this.observer;
  }

  public get isDisposed(): boolean {
    return this.stateOfIsDisposed;
  }

  public dispose(): void {
    if (this.stateOfIsDisposed) {
      return;
    }

    this.stateOfIsDisposed = true;

    this.observer.unsubscribe();
  }

  public getEmitterFor<K extends keyof T>(event: K): T[K] | undefined {
    return this.observer.getEmitterFor(event);
  }

  public emit<K extends keyof T>(event: K, ...args: Parameters<T[K]>): void {
    const emitter = this.getEmitterFor(event);

    if (emitter) {
      emitter(...args);
    }
  }
}
