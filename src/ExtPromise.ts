const NOOP = (): void => {/*NOOP*/ };

/**
 * A promise that can be resolved externally, or cancelled.
 */
export class ExtPromise<T = void>
{
    /**
     * The method to resolve this promise.
     */
    public resolve: (result: T) => void = NOOP;
    /**
     * The method to reject this promise.
     */
    public reject: (error: any) => void = NOOP;
    /**
     * The promise to use to await on.
     */
    public readonly promise: Promise<T>;
    private _complete: boolean = false;
    private _cancelled: boolean = false;
    /**
     * If this promise has been completed (resolved or rejected).
     */
    public get complete(): boolean { return this._complete; }
    /**
     * If this promise has been cancelled, and will never resolve.
     */
    public get cancelled(): boolean { return this._cancelled; }

    constructor()
    {
        this.promise = new Promise((resolve, reject) =>
        {
            this.resolve = (d: T) =>
            {
                if (this._cancelled) return;
                this._complete = true;
                resolve(d);
            };
            this.reject = (e: any) =>
            {
                if (this._cancelled) return;
                this._complete = true;
                reject(e);
            };
        });
    }

    /**
     * Cancels this promise so that it will never resolve.
     */
    public cancel(): void
    {
        this._cancelled = true;
    }
}