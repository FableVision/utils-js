/**
 * A pattern for an object with a cleanup method called dispose().
 * As designed, calling dispose() multiple times should not throw an error.
 * Later reuse of the disposable after calling dispose() is left up to the individual
 * implementation.
 */
export interface IDisposable
{
    dispose():void;
}

/**
 * A basic IDisposable implementation that wraps a cleanup method.
 */
export class Disposable implements IDisposable
{
    protected cleanup: (() => void)|null;

    constructor(cleanup: () => void)
    {
        this.cleanup = cleanup;
    }

    /**
     * Performs the cleanup method - single use. Calling again will not perform cleanup again.
     */
    public dispose(): void
    {
        this.cleanup?.();
        this.cleanup = null;
    }

    /**
     * An alias for dispose().
     */
    public destroy(): void
    {
        this.dispose();
    }
}

/**
 * Handles a group of IDisposable objects to be cleaned up at once.
 */
export class DisposableGroup extends Disposable
{
    private group: IDisposable[]|null;

    constructor(...group: IDisposable[])
    {
        super(() => {
            if (this.group)
            {
                for (const d of this.group)
                {
                    d.dispose();
                }
            }
            this.group = null;
        });
        this.group = group;
    }

    /**
     * Adds any number of disposable objects for later cleanup.
     */
    public add(...group: IDisposable[]): void
    {
        if (!this.group)
        {
            this.group = [];
        }

        this.group.push(...group);
    }

    public dispose()
    {
        this.cleanup!();
    }

    /** Disposes the group, but then sets it back up to allow further uses of add() */
    public reset(): void
    {
        this.dispose();
        // restore group for reuse.
        this.group = [];
    }
}
