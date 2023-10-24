class Pending {
    #collection;
    #name;
    constructor(name) {
        this.#name = name;
        this.#collection = this.fetch();
    }
    add(...items) {
        const newItemList = items.filter((item) => !this.#collection.includes(item));
        if (newItemList.length == 0) return;
        this.#collection.push(...newItemList);
        this.#commit();
    }
    remove(...items) {
        const itemExistingList = items.filter((item) => this.#collection.includes(item));
        if (itemExistingList.length == 0) return;
        this.#collection.remove(...itemExistingList);
        this.#commit();
    }

    fetch() {
        return JSON.parse(localStorage.getItem(this.#name)) || [];
    }

    #commit() {
        if (this.#collection.length > 0) {
            localStorage.setItem(this.#name, JSON.stringify(this.#collection));
        } else {
            localStorage.removeItem(this.#name);
        }
    }
}
