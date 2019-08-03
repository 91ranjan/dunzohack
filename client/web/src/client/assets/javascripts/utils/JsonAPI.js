import request from 'superagent';
import qs from 'querystring';

import { IP_ADDR } from 'constants/ConfigConstant';

export const ipAddr = IP_ADDR;
const apiUrl = '';
const defaultToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjaWQiOiIzIiwiY25hbWUiOiJzbGlja28gcHZ0IGx0ZCIsImlkIjoiMiIsIm5hbWUiOiJ1bmRlZmluZWQgdW5kZWZpbmVkIiwiZW1haWwiOiJzdW5mYWNlQGdtYWlsLmNvbSIsInJvbGVzIjpbImJ1eWVyIl0sInJlcG9ydGVkSWQiOltdLCJpYXQiOjE1MzM2NjY0MTAsImV4cCI6MTUzMzY3MTQxMH0.SqD5olIXqzAXnTslbAdJxV0qQCWEc5ATJanDPbKTiQ0';

function getUrl(url, opts = {}) {
    return (opts.ipAddr || ipAddr) + apiUrl + url;
}

export function get(url, data, opts = {}) {
    let finalData = Object.assign({}, data);
    // finalData.cacheBurst = new Date().getTime();
    const urlString = getUrl(url, opts);
    const token = localStorage.getItem('token') || null;
    const rq = request.get(urlString);

    return rq
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', localStorage.getItem('token'))
        .query(qs.stringify(finalData));
}

export function post(url, data, opts) {
    const urlString = getUrl(url, opts);
    const token = localStorage.getItem('token') || defaultToken;
    return request
        .post(urlString)
        .send(data)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', localStorage.getItem('token'));
}

export function upload(url, formData, opts) {
    const urlString = getUrl(url, opts);
    const token = localStorage.getItem('token') || defaultToken;

    return (
        request
            .post(urlString)
            .send(formData)
            .set('x-files-upload', true)
            .set('x-access-token', token)
            // .set('Content-Type', 'multipart/form-data')
            //.set('Content-Type', 'multipart/form-data')
            .set('Accept', 'application/json')
            .set('Authorization', localStorage.getItem('token'))
    );
}

export function put(url, data, opts) {
    const urlString = getUrl(url, opts);
    const token = localStorage.getItem('token') || null;
    return request
        .put(urlString)
        .send(data)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', localStorage.getItem('token'));
}

export function deleteReq(url, data, opts) {
    const urlString = getUrl(url, opts);
    const token = localStorage.getItem('token') || null;
    return request
        .delete(urlString)
        .send(data)
        .set('Accept', 'application/json')
        .set('Authorization', localStorage.getItem('token'));
}
