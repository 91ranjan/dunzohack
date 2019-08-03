import * as lru from 'lru-cache';
import * as redis from 'redis';
import * as redislru from 'redis-lru';
import * as logger from 'tracer';
import * as fs from 'fs';
import GlobalVars from './GlobalVars';

const _console = logger.colorConsole();

class Cache {
    _agent;
    constructor() {}

    init() {
        if (GlobalVars.get('caching') === 'LRU') {
            this._agent = new lru();
        } else if (GlobalVars.get('caching') === 'REDIS') {
            const redisServer = redis.createClient({});
            this._agent = redislru(redisServer, 5);
        }
        this.load();
    }

    async get(key) {
        return await this._agent.get(key);
    }

    async set(key, value, opts?) {
        if (!opts) {
            opts = {};
        }
        if (this._agent.get(key)) {
            this._agent.del(key);
        }
        await this._agent.set(key, value);
    }

    del(key) {
        this._agent.del(key);
    }

    reset() {
        return this._agent.reset();
    }

    has(key) {
        return this._agent.has(key);
    }

    forEach(cb) {
        this._agent.forEach(cb);
    }

    keys() {
        return this._agent.keys();
    }

    values() {
        return this._agent.values();
    }

    length() {
        return this._agent.length;
    }

    dump() {
        if (GlobalVars.get('caching') === 'LRU') {
            const cache = this._agent.dump();
            try {
                fs.writeFileSync('acp_cache.json', JSON.stringify(cache), { mode: 0o755 });
            } catch (err) {
                // An error occurred
                _console.error(err.message);
            }
        }
    }

    load() {
        if (GlobalVars.get('caching') === 'LRU') {
            try {
                const cache = fs.readFileSync('acp_cache.json', 'utf8');
                if (cache) {
                    this._agent.load(JSON.parse(cache));
                }
            } catch (err) {
                // An error occurred
                _console.error(err.message);
            }
        }
    }

    prune() {
        return this._agent.prune();
    }
}

export default new Cache();
