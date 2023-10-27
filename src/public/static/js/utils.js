/**
 * Remove item from an array by value
 * @param {...any} arguments
 */
Array.prototype.remove = function () {
    const arr = this;
    const itemList = [...arguments];
    itemList.forEach((v) => {
        const i = arr.indexOf(v);
        if (i > -1) arr.splice(i, 1);
    });
};

/**
 * Insert the specified values inside a string's placeholder,
 * it's defined using numbered indexs {0}
 * @param {...string|number} arguments
 * @returns {string}
 */
String.prototype.format = String.prototype.f = function () {
    let s = this;
    const itemList = [...arguments];
    itemList.forEach((v, i) => {
        s = s.replace(new RegExp('\\{' + i + '\\}', 'gm'), v);
    });

    return s;
};

/**
 * A simplified way to interact with localStorage as an array
 */
class Pending {
    #collection;
    #name;

    /** Initialize the private variables
     * @constructor
     * @param {string} name
     */
    constructor(name) {
        this.#name = name;
        this.#collection = this.fetch();
    }

    /**
     * Check whether a value contains
     * @param {*} value
     * @returns
     */
    contains(value) {
        return this.#collection.includes(value);
    }

    /** Add to localStorage if not exists
     * @param {...any} arguments
     */
    add() {
        const itemList = [...arguments];
        itemList.forEach((item) => {
            if (!this.contains(item)) this.#collection.push(item);
        });
        this.#migrate();
    }

    /** Remove from localStorage if exists
     * @param {...any} arguments
     */
    remove() {
        const itemList = [...arguments];
        itemList.forEach((item) => {
            if (this.contains(item)) this.#collection.remove(item);
        });
        this.#migrate();
    }

    /**
     * Fetch data from localStorage
     * @returns {Array}
     */
    fetch() {
        return JSON.parse(localStorage.getItem(this.#name)) || [];
    }

    /**
     * Migrate data to localStorage
     */
    #migrate() {
        if (this.#collection.length > 0) {
            localStorage.setItem(this.#name, JSON.stringify(this.#collection));
        } else {
            localStorage.removeItem(this.#name);
        }
    }
}
