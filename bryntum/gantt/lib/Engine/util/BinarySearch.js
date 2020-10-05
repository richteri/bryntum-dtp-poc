export const binarySearch = (value, array, comparator = (a, b) => a - b) => {
    let left = 0;
    let right = array.length;
    while (left < right) {
        const mid = (left + right) / 2 | 0;
        const compare = comparator(value, array[mid]);
        if (compare === 0)
            return { found: true, index: mid };
        else if (compare < 0)
            right = mid;
        else
            left = mid + 1;
    }
    return { found: false, index: right };
};
//# sourceMappingURL=BinarySearch.js.map