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
    parseJSON: function (val) {
        try {
            return JSON.parse(val);
        } catch (e) {
            return undefined;
        }
    },
};
