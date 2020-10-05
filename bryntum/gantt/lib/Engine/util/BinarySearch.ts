// Generic binary search
export const binarySearch = (

    value       : any,
    array       : any[],
    comparator  : (a : any, b : any) => number = (a, b) => a - b

) : { found : boolean, index : number } => {

    let left    = 0
    let right   = array.length

    while (left < right) {
        // | 0 to make it integer, faster according to: https://jsperf.com/or-vs-floor/2
        const mid   = (left + right) / 2 | 0

        const compare = comparator(value, array[ mid ])

        if (compare === 0)
            return { found : true, index : mid }
        else if (compare < 0)
            right   = mid
        else
            left    = mid + 1
    }

    return { found : false, index : right }
}
