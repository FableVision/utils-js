import { randInt } from "./math";

/**
 * Returns the last element of an array.
 */
export function last<T>(arr: T[]): T
{
    return arr[arr.length - 1];
}

/**
 * Gets a single random element from a given array.
 */
export function randElement<T>(arr: T[]): T
{
    return arr[randInt(0, arr.length - 1)];
}

/**
 * Performs a Fisher-Yates shuffle on an array (in place) and returns it.
 */
export function shuffle<T extends Array<any>>(arr: T): T
{
    // go from length - 1 down to 1 - fisher-yates shuffle
    for (let i = arr.length - 1; i > 0; --i)
    {
        const j = randInt(0, i);
        const temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }
    return arr;
}

/**
 * Makes a copy of an array, shuffles it, and returns it.
 * The original array is untouched.
 */
export function shuffleCopy<T extends Array<any>>(arr: T): T
{
    return shuffle(arr.slice() as T);
}