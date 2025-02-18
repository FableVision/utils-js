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

/**
 * Moves the first element of the array to the end, moving all other elements up one position.
 * This modifies the original array.
 */
export function rotateForward<T extends Array<any>>(arr: T): T
{
    const first = arr[0];
    for (let i = 0; i < arr.length - 1; ++i)
    {
        arr[i] = arr[i + 1];
    }
    arr[arr.length - 1] = first;

    return arr;
}

/**
 * Moves the last element of the array to the front, moving all other elements back one position.
 * This modifies the original array.
 */
export function rotateBackward<T extends Array<any>>(arr: T): T
{
    const last = arr[arr.length - 1];
    for (let i = arr.length - 1; i > 0; --i)
    {
        arr[i] = arr[i - 1];
    }
    arr[0] = last;

    return arr;
}

/**
 * Gets a value from an array, looping the index if it is negative or past the array length.
 */
export function getLoopedValue<T>(arr: T[], index: number): T
{
    while (index < 0)
        index += arr.length;
    while (index >= arr.length)
        index -= arr.length;

    return arr[index];
}