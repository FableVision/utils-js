/**
 * Gets a random integer between two numbers, inclusive.
 */
export function randInt(min: number, max: number): number
{
    return min + (Math.floor(Math.random() * (max - min)));
}

/**
 * Clamps the value between the minimum and maximum (inclusive).
 */
export function clamp(value: number, min: number, max: number): number
{
    return Math.min(max, Math.max(value, min));
}