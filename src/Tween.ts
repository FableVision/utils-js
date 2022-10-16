// Borrowed from WGBH's springroll game library: https://github.com/WGBH/wgbh-springroll-game/blob/master/src/tween/Tween.ts
import * as eases from 'eases';
import { IDisposable } from './Disposable';
import { globalTimer } from './Timer';

// eslint-disable-next-line @typescript-eslint/naming-convention
const Eases: typeof eases = (eases as any).default;

/** type to get all keys for all properties of type V on target T **/
type KeysMatching<T, V> = { [K in keyof T]: T[K] extends V ? K : never }[keyof T];
/** type to be just the number properties of a target T, but all optional. */
type TargetProps<T> = Partial<Pick<T, KeysMatching<T, number>>>;

/**
 * A class for tweening object properties. This runs off of the globalTimer Timer variable, so make sure that is
 * running or being ticked.
 *
 * Usage:
 * ```
 * Tween.get(myObj).to({x: 5, y: 10}, 2, 'quadInOut').promise;
 * ```
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export class Tween<T extends object> implements IDisposable
{
    static tweens: Set<Tween<any>> = new Set();

    public paused = false;

    private target: any;
    private steps: TweenStep[] = [];
    private currentStep: number = 0;
    private loop: number = 0;
    private onComplete: (() => void) | null = null;
    private timerListener!: IDisposable;

    private _promise: Promise<void> | null = null;
    private _resolve: (() => void) | null = null;


    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    constructor(target: any)
    {
        this.target = target;
    }

    // eslint-disable-next-line @typescript-eslint/ban-types
    public static get<T extends object>(target: T, options: TweenOptions = {}): Tween<T>
    {
        if (options.override)
        {
            this.removeTweens(target);
        }
        const tween = new Tween(target);
        if (options.loop)
        {
            if (options.loop === true)
            {
                tween.loop = -1;
            }
            else if (options.loop % 1)
            {
                console.error('Tween options.loop must be an integer. Got: ', options.loop);
                tween.loop = options.loop;
            }
        }
        if (options.onComplete)
        {
            tween.onComplete = options.onComplete;
        }
        Tween.tweens.add(tween);
        tween.timerListener = globalTimer.add(tween.update);
        return tween;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    public static removeTweens(target: any)
    {
        for (const tween of Tween.tweens.values())
        {
            if (tween.target == target)
            {
                tween.destroy();
            }
        }
    }

    public static removeAllTweens(): void
    {
        for (const tween of Tween.tweens.values())
        {
            tween.destroy();
        }
    }

    /**
     * Tweens one or more properties to the given value.
     * @param targetValues Properties corresponding end values to tween to.
     * @param totalTime Time in seconds to perform tweening.
     * @param ease Name of ease method to apply to interpolation.
     */
    public to = (targetValues: TargetProps<T>, totalTime: number, ease: Ease = 'linear'): this =>
    {
        this.steps.push({ targetValues, totalTime, ease: Eases[ease] });
        return this;
    };

    /**
     * Waits a number of seconds before continuing.
     * @param totalTime Time to wait, in seconds.
     */
    public wait = (totalTime: number): this =>
    {
        this.steps.push({ totalTime });
        return this;
    };

    /**
     * Performs a callback when this step is reached.
     */
    public call = (call: () => void): this =>
    {
        this.steps.push({ call });
        return this;
    };

    /**
     * Gets a promise for when the tween is fully complete.
     */
    public get promise(): Promise<void>
    {
        if (!this._promise)
        {
            this._promise = new Promise((resolve) => { this._resolve = resolve; });
        }
        return this._promise;
    }

    private doComplete(): void
    {
        if (this.onComplete)
        {
            this.onComplete();
        }
        if (this._resolve)
        {
            this._resolve();
        }
        this.destroy();
    };

    private update = (elapsed: number) =>
    {
        if (this.paused)
        {
            return;
        }
        if (this.steps.length <= this.currentStep)
        {
            if (this.loop)
            {
                if (this.loop > 0)
                {
                    this.loop--;
                }
                this.currentStep = 0;
                for (const step of this.steps)
                {
                    step.currentTime = 0;
                }
            }
            else
            {
                this.doComplete();
                return;
            }
        }
        const step = this.steps[this.currentStep];
        if (step.call)
        {
            this.currentStep++;
            return step.call();
        }
        if (!step.currentTime)
        {
            step.currentTime = 0;
            if (step.targetValues)
            {
                step.initialValues = {};
                for (const key in step.targetValues)
                {
                    step.initialValues[key] = this.target[key];
                }
            }
        }
        step.currentTime += elapsed;
        const time = step.currentTime / step.totalTime! > 1 ? 1 : step.currentTime / step.totalTime!;
        if (step.targetValues)
        {
            for (const key in step.targetValues)
            {
                this.target[key] = step.initialValues[key] + step.ease!(time) * (step.targetValues[key] - step.initialValues[key]);
            }
        }

        if (time >= 1)
        {
            this.currentStep++;
        }
    };

    /**
     * Stops and cleans up the tween.
     */
    public destroy(): void
    {
        this.timerListener.dispose();
        Tween.tweens.delete(this);
        this.target = null;
        this.steps = null as any;
        this.currentStep = 0;
        this._promise = null;
        this._resolve = null;
    }

    /**
     * Stops and cleans up the tween.
     */
    public dispose(): void
    {
        this.destroy();
    }
}

export type TweenStep = {
    targetValues?: any;
    initialValues?: any;
    currentTime?: number;
    totalTime?: number;
    ease?: (t: number) => number;
    call?: () => void;
};

export type TweenOptions = {
    override?: boolean;
    loop?: number | true;
    onComplete?: () => void;
};

export type Ease = keyof typeof eases;