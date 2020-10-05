/**
 * @private
 * Extendable comparator function
 */
export type ComparatorFn<T> = (a : T, b : T) => number

export enum EdgeInclusion {
    Left,
    Right
}
