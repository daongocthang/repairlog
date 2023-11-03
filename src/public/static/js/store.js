const cookie = {
    /**
     * Set a new cookie
     * @param {string} cName
     * @param {string} cValue
     * @param {number} expDays - expiry date
     */
    set: function (cName, cValue, expDays) {
        let expires = '';
        if (expDays) {
            const date = new Date();
            date.setTime(date.getTime() + expDays * 24 * 60 * 60 * 1000);
            expires = `;expires=${date.toUTCString()}`;
        }
        document.cookie = `${encodeURIComponent(cName)}=${encodeURIComponent(cValue || '') + expires};path=/`;
    },
    /**
     * Remove a cookie by name
     * @param {string} cName
     */
    remove: function (cName) {
        this.set(cName, undefined, -1);
    },

    /**
     * Get a cookie by name
     * @param {string} cName
     * @returns {string}
     */
    get: function (cName) {
        return this.toDict()[cName];
    },

    /**
     * Convert all cookies to an object
     * @returns
     */
    toDict: function () {
        const itemList = document.cookie.split(/[;] */);
        return itemList.reduce((dict, curItem) => {
            const pair = curItem.split('=');
            if (pair.length === 2) dict[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
            return dict;
        }, {});
    },

    /**
     * Parse a JSON string
     * @param {string} val
     * @returns
     */
    asJson: function (val) {
        try {
            return JSON.parse(val);
        } catch (e) {
            return undefined;
        }
    },
};

/**
 * A simplified way to interact with localStorage as an array
 */
class Pending {
    #collection;
    #name;

    /** Initialize the private variables
     * @constructor
     * @param {string} id
     */
    constructor(id) {
        this.#name = id + '.pending';
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
