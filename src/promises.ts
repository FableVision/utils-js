/**
 * Waits the specified number of milliseconds, then resolves.
 * @param milliseconds The number of milliseconds to wait.
 */
export function wait(milliseconds: number): Promise<void>
{
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}