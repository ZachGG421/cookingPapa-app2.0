const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 2592000 });

module.exports = {
    set(key, value) {
        console.log(`Cache set for key: ${key}`);
        cache.set(key, value);
    },
    get(key) {
        console.log(`Cache get for key: ${key}`);
        return cache.get(key);
    },
    has(key) {
        const exists = cache.has(key);
        console.log(`Cache has key "${key}": ${exists}`);
        return exists;
    },
};