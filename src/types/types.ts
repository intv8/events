/**
 * This file exports type aliases used by the the intv8 events package
 * and its peer and dependant packages.
 *
 * For type aliases, see ./interfaces.ts.
 *
 * @copyright 2022 integereleven. All rights reserved. MIT license.
 */

/** A handler for an event. */
// deno-lint-ignore no-explicit-any
export type EventHandler = (...args: any[]) => void;

/** Describes a collection of available events and their handler signatures. */
export type TEventRegistry<T extends Record<string, EventHandler>> = Map<
  keyof T,
  T[keyof T][]
>;

type AddEventNotification<T extends Record<string, EventHandler>> = {
  event: keyof T;
  emitter: T[keyof T];
  action: 'add';
};

type RemoveEventNotification<T extends Record<string, EventHandler>> = {
  event: keyof T;
  action: 'remove';
};

export type EventNotification<T extends Record<string, EventHandler>> =
  | AddEventNotification<T>
  | RemoveEventNotification<T>;
