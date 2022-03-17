import { Disposable, IDisposable } from './Disposable';

/**
 * A strongly typed event emitter using the IDisposable pattern for cleanup.
 * Handles a single event, create one for each event you need to emit.
 */
export class Event<T> implements IDisposable
{
    private listeners: Set<(value: T) => void>;

    constructor()
    {
        this.listeners = new Set();
    }

    /**
     * Emits this event with the given value.
     * @param value The event data to be sent to listeners.
     */
    public emit(value: T): void
    {
        for (const listener of this.listeners)
        {
            listener(value);
        }
    }

    /**
     * Adds a listener.
     * @param listener Function to call when events are emitted.
     * @returns A disposable token to remove that listener.
     */
    public add(listener: (value: T) => void): Disposable
    {
        this.listeners.add(listener);
        return new Disposable(() => this.listeners?.delete(listener));
    }

    /**
     * An alias for add().
     * @param listener Function to call when events are emitted.
     * @returns A disposable token to remove that listener.
     */
    public on(listener: (value: T) => void): Disposable
    {
        return this.add(listener);
    }

    /**
     * Adds a listener that will be removed after one event is emitted.
     * @param listener Function to call when events are emitted.
     * @returns A disposable token to remove that listener.
     */
    public once(listener: (value: T) => void): Disposable
    {
        // eslint-disable-next-line prefer-const
        let cleanup: Disposable;
        const wrapper = (value: T) => {
            cleanup.dispose();
            listener(value);
        };
        cleanup = this.add(wrapper);
        return cleanup;
    }

    /**
     * Cleans up the event emitter, removing all listeners.
     * This does not fully destroy the emitter, so it can be reused later.
     */
    public dispose(): void
    {
        this.listeners.clear();
    }

    /**
     * An alias for dispose().
     */
    public destroy(): void
    {
        this.dispose();
    }
}