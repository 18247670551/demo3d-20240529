export default {
    set(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    },
    get(key) {
        try {
            const valueString = localStorage.getItem(key);
            if (valueString) {
                return JSON.parse(valueString);
            }
            else {
                return null;
            }
        }
        catch (e) {
            return null;
        }
    },
    remove(key) {
        localStorage.removeItem(key);
    },
};
//# sourceMappingURL=localStorageUtils.js.map