/* eslint-disable @typescript-eslint/no-explicit-any */
'use strict';

class HashMap<K, V> {
    readonly _keys: Array<K> = [];
    readonly _values: Array<V> = [];

    size(): number {
        return this._keys.length;
    }

    indexOfKey(key: K): number {
        for (const i in this._keys) {
            const item = this._keys[i];
            if (item === key) {
                return parseInt(i, 10);
            }
        }
        return -1;
    }

    has(key: K): boolean {
        return this.containsKey(key);
    }

    containsKey(key: K): boolean {
        for (const item of this._keys) {
            if (item === key) {
                return true;
            }
        }
        return false;
    }

    containsValue(value: V): boolean {
        for (const item of this._values) {
            if (item === value) {
                return true;
            }
        }
        return false;
    }

    set(key: K, value: V): void {
        this.put(key, value);
    }

    put(key: K, value: V): void {
        this.delete(key);

        this._keys.push(key);
        this._values.push(value);
    }

    get(key: K): V | undefined {
        const index = this.indexOfKey(key);
        return index === -1 ? undefined : this._values[index];
    }

    keys(): Array<K> {
        return this._keys.concat();
    }

    values(): Array<V> {
        return this._values.concat();
    }

    remove(key: K): V | undefined {
        return this.delete(key);
    }

    delete(key: K): V | undefined {
        const index = this.indexOfKey(key);
        if (index === -1) {
            return undefined;
        }
        this._keys.splice(index, 1);
        const array = this._values.splice(index, 1);
        return array.length > 0 ? array[0] : undefined;
    }

    clear(): void {
        this._keys.splice(0, this._keys.length);
        this._values.splice(0, this._values.length);
    }

    forEach(func: (value: V, key: K) => void): void {
        const keys = this.keys();
        const values = this.values();
        for (const i in keys) {
            const key = keys[i];
            const value = values[i];
            func(value, key);
        }
    }
}

export default HashMap;
