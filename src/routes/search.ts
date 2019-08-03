import * as express from 'express';
import { parallel } from 'async';

import { Response, Request, NextFunction } from 'express';
import SearchController from '../controllers/SearchCtrl';
const SearchCtrl = new SearchController();

export default class SearchRoute {
    router: express.Router;
    _express;
    _jira;
    _puppet;
    constructor(jira, puppet) {
        this.router = express.Router();
        this._jira = jira;
        this._puppet = puppet;
        this.init();
    }

    init() {
        this.router.get('/', this.get);
        this.router.get('/:id', this.getById);
        this.router.post('/', this.create);
        this.router.put('/', this.update);
        this.router.delete('/:id', this.delete);
    }

    get(req, res) {
        const promises = [SearchCtrl.getAll(req.query), SearchCtrl.getCount(req.query)];
        parallel(
            promises.map(query => {
                return cb => {
                    query.then(data => cb(undefined, data)).catch(err => cb(err, undefined));
                };
            }),
            (err, results = []) => {
                if (err) {
                    res.status(400).send({
                        message: err,
                    });
                } else {
                    res.json({ data: results[0], total: results[1] });
                }
            }
        );
    }

    getById(req, res) {
        SearchCtrl.getById(req.params.id)
            .then(data => {
                res.status(200).send({ message: 'success', data, totalRecords: data.length });
            })
            .catch(e => {
                res.status(400).send({ message: e.message });
            });
    }

    create(req, res) {
        SearchCtrl.create(req.body)
            .then(data => {
                res.status(200).send({ message: 'success', data });
            })
            .catch(e => {
                res.status(400).send({ message: e.message });
            });
    }

    update(req, res) {
        SearchCtrl.update(req.body)
            .then(data => {
                res.status(200).send({ message: 'success', data });
            })
            .catch(e => {
                res.status(400).send({ message: e.message });
            });
    }

    delete(req, res) {
        SearchCtrl.delete(req.params.id)
            .then(data => {
                res.status(200).send({ message: 'success', data });
            })
            .catch(e => {
                res.status(400).send({ message: e.message });
            });
    }
}
