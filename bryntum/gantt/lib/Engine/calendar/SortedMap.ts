import { binarySearch } from "../util/BinarySearch.js"
import { ComparatorFn } from "../util/Types.js"

export enum IndexPosition {
    Exact,
    Next
}

export type SortedMapEntry<K, V> = {
    key     : K,
    value   : V
}

// TODO store keys and values in a single array of "entries"? less memory movement during insert/delete in theory

export class SortedMap<KeyType = number, ValueType = any> {

    keys            : KeyType[]     = []
    values          : ValueType[]   = []

    comparator      : ComparatorFn<KeyType>


    constructor (comparator? : ComparatorFn<KeyType>) {
        this.comparator = comparator || ((a : any, b : any) => a - b)
    }


    set (key : KeyType, value : ValueType) {
        const search    = binarySearch(key, this.keys, this.comparator)

        if (search.found) {
            this.values[ search.index ] = value
        } else {
            this.keys.splice(search.index, 0, key)
            this.values.splice(search.index, 0, value)
        }

        return search.index
    }


    // you need to know what you are doing when using this method
    insertAt (index : number, key : KeyType, value : ValueType) {
        this.keys.splice(index, 0, key)
        this.values.splice(index, 0, value)
    }


    setValueAt (index : number, value : ValueType) {
        this.values[ index ] = value
    }


    get (key : KeyType) : ValueType {
        const search    = binarySearch(key, this.keys, this.comparator)

        return search.found ? this.values[ search.index ] : undefined
    }


    getEntryAt (index : number) : SortedMapEntry<KeyType, ValueType> {
        return index < this.keys.length ? { key : this.keys[ index ], value : this.values[ index ] } : undefined
    }


    getKeyAt (index : number) : KeyType {
        return this.keys[ index ]
    }


    getValueAt (index : number) : ValueType {
        return this.values[ index ]
    }


    delete (key : KeyType) {
        const search    = binarySearch(key, this.keys, this.comparator)

        if (search.found) this.deleteAt(search.index)
    }


    size () : number {
        return this.keys.length
    }


    deleteAt (index : number) {
        this.keys.splice(index, 1)
        this.values.splice(index, 1)
    }


    indexOfKey (key : KeyType) : { found : IndexPosition, index : number } {
        const search    = binarySearch(key, this.keys, this.comparator)

        return {
            found       : search.found ? IndexPosition.Exact : IndexPosition.Next,
            index       : search.index
        }
    }


    map <T> (
        func        : (value? : ValueType, key? : KeyType, index? : number) => T
    ) : T[] {
        const keys      = this.keys
        const values    = this.values

        const result    = []

        for (let i = 0; i < keys.length; i++)
            result.push(func(values[ i ], keys[ i ], i))

        return result
    }


    getAllEntries () : SortedMapEntry<KeyType, ValueType>[] {
        return this.map((value, key) => { return { value, key } })
    }


    clear () {
        this.keys.length    = 0
        this.values.length  = 0
    }
}
