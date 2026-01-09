import { Event } from "./Event";

/**
 * Timer that uses requestAnimationFrame() (or manual updates) to emit elapsed frame time in seconds.
 */
export class Timer extends Event<number>
{
    private lastTime: number;
    private raf: number;
    private rafCB: () => void;
    /** Multiplier to actual time elapsed to apply to the emitted time elapsed. */
    public speed: number;

    constructor()
    {
        super();

        this.lastTime = 0;
        this.raf = 0;
        this.speed = 1;
        this.rafCB = () => {
            this.raf = requestAnimationFrame(this.rafCB);
            this.tick();
        };
    }

    /**
     * Ticks the timer. This can be called manually, and will calculate the time since the last call.
     */
    public tick(): void
    {
        const now = performance.now() / 1000;
        const elapsed = now - this.lastTime;
        this.lastTime = now;
        this.emit(elapsed * this.speed);
    }

    /** Tick with a specific amount of time, instead of calculating actual time. */
    public tickOverride(elapsedSeconds: number): void
    {
        this.lastTime = performance.now() / 1000;
        this.emit(elapsedSeconds);
    }

    /**
     * Resets the last time for calculating elapsed time.
     * If you are manually ticking the timer, call this after pauses so that the first tick doesn't include
     * all of the paused time in its elapsed value.
     */
    public resetElapsed(): void
    {
        this.lastTime = performance.now();
    }

    /**
     * Starts the timer.
     */
    public start(): void
    {
        this.stop();

        this.raf = requestAnimationFrame(this.rafCB);
        this.resetElapsed();
    }

    /**
     * Stops the timer.
     */
    public stop(): void
    {
        if (this.raf)
        {
            cancelAnimationFrame(this.raf);
            this.raf = 0;
        }
    }
}

/**
 * A global timer for code anywhere to attach to. This timer does not automatically start, so if you use code
 * that relies on it you will need to start or tick it yourself.
 */
export const globalTimer = new Timer();