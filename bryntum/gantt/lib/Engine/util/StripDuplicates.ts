/**
 * @private
 * Strips duplicate entries from an array
 */
export const stripDuplicates = <T>(array : T[]) : T[] => {
    const seen  : Map<T, boolean> = new Map()

    return array.filter(el => {
        if (seen.has(el)) return false

        seen.set(el, true)

        return true
    })
}
