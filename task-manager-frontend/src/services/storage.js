export function saveElement(element, key = "History", storage = localStorage) {
    let saved = JSON.parse(storage.getItem(key) || "[]");

    for (let i = 0; i < saved.length; i++) {
        if (saved[i].id === element.id) return false;
    }

    saved[saved.length] = element;
    storage.setItem(key, JSON.stringify(saved));
    return true;
}


export function getSavedElements(key = "History", storage = localStorage) {
    let saved = storage.getItem(key);
    if (!saved) return [];
    return JSON.parse(saved);
}

export function removeElements(keysDict, storage = localStorage) {
    for (let key in keysDict) {
        storage.removeItem(key);
    }
}

export function clearAllElements(key = "History", storage = localStorage) {
    storage.removeItem(key);
}
