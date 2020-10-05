import { binarySearch } from "../util/BinarySearch.js";
export var IndexPosition;
(function (IndexPosition) {
    IndexPosition[IndexPosition["Exact"] = 0] = "Exact";
    IndexPosition[IndexPosition["Next"] = 1] = "Next";
})(IndexPosition || (IndexPosition = {}));
export class SortedMap {
    constructor(comparator) {
        this.keys = [];
        this.values = [];
        this.comparator = comparator || ((a, b) => a - b);
    }
    set(key, value) {
        const search = binarySearch(key, this.keys, this.comparator);
        if (search.found) {
            this.values[search.index] = value;
        }
        else {
            this.keys.splice(search.index, 0, key);
            this.values.splice(search.index, 0, value);
        }
        return search.index;
    }
    insertAt(index, key, value) {
        this.keys.splice(index, 0, key);
        this.values.splice(index, 0, value);
    }
    setValueAt(index, value) {
        this.values[index] = value;
    }
    get(key) {
        const search = binarySearch(key, this.keys, this.comparator);
        return search.found ? this.values[search.index] : undefined;
    }
    getEntryAt(index) {
        return index < this.keys.length ? { key: this.keys[index], value: this.values[index] } : undefined;
    }
    getKeyAt(index) {
        return this.keys[index];
    }
    getValueAt(index) {
        return this.values[index];
    }
    delete(key) {
        const search = binarySearch(key, this.keys, this.comparator);
        if (search.found)
            this.deleteAt(search.index);
    }
    size() {
        return this.keys.length;
    }
    deleteAt(index) {
        this.keys.splice(index, 1);
        this.values.splice(index, 1);
    }
    indexOfKey(key) {
        const search = binarySearch(key, this.keys, this.comparator);
        return {
            found: search.found ? IndexPosition.Exact : IndexPosition.Next,
            index: search.index
        };
    }
    map(func) {
        const keys = this.keys;
        const values = this.values;
        const result = [];
        for (let i = 0; i < keys.length; i++)
            result.push(func(values[i], keys[i], i));
        return result;
    }
    getAllEntries() {
        return this.map((value, key) => { return { value, key }; });
    }
    clear() {
        this.keys.length = 0;
        this.values.length = 0;
    }
}
//# sourceMappingURL=SortedMap.js.map