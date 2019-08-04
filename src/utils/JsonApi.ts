import * as superagent from 'superagent';
import * as btoa from 'btoa';
export default class JsonApi {
    constructor() {}

    get(url, data, opts) {
        return superagent
            .get(url)
            .query(data)
            .set('Authorization', 'Basic ' + btoa('ritesh.ranjan1:91@Sonus'))
            .set('Accept', 'application/json');
    }

    post(url, data, opts) {
        return superagent
            .post(url)
            .send(data)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json');
    }

    put(url, data, opts) {
        return superagent
            .put(url)
            .send(data)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json');
    }
}
