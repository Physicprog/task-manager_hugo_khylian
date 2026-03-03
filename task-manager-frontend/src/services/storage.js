export function removeElements(keysDict, storage = localStorage) {
    for (let key in keysDict) {
        storage.removeItem(key);
    }
}
