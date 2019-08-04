import * as express from "express";
import * as multer from 'multer';
import { parallel } from "async";

var upload = multer({ dest: 'uploads/', fieldname: 'file' })
import RecieptController from "../controllers/RecieptCtrl";
const RecieptCtrl = new RecieptController();

import { main } from '../../client/jsparser/textparser'

export default class RecieptsRoute {
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

        this.router.get("/", this.get);
        this.router.get("/compute", this.compute);
        this.router.get("/:id", this.getById);
        this.router.post("/", upload.single('file'), this.computeImage);
        this.router.put("/", this.update);
        this.router.delete("/:id", this.delete);
    }

    get(req, res) {
        const promises = [
            RecieptCtrl.getAll(req.query),
            RecieptCtrl.getCount(req.query)
        ];
        parallel(
            promises.map(query => {
                return cb => {
                    query
                        .then(data => cb(undefined, data))
                        .catch(err => cb(err, undefined));
                };
            }),
            (err, results = []) => {
                if (err) {
                    res.status(400).send({
                        message: err
                    });
                } else {
                    res.json({ data: results[0], total: results[1] });
                }
            }
        );
    }

    getById(req, res) {
        RecieptCtrl.getById(req.params.id)
            .then(data => {
                res
                    .status(200)
                    .send({ message: "success", data, totalRecords: data.length });
            })
            .catch(e => {
                res.status(400).send({ message: e.message });
            });
    }

    async compute(req, res) {
        const resp = await RecieptCtrl.analyze()
        res.json({ data: resp });
    }

    computeImage(req, res) {
        // console.log(req.body);
        RecieptCtrl.create(req.body)
            .then(data => {
                res.status(200).send({ message: "success", data });
            })
            .catch(e => {
                res.status(400).send({ message: e.message });
            });
    }

    update(req, res) {
        RecieptCtrl.update(req.body)
            .then(data => {
                res.status(200).send({ message: "success", data });
            })
            .catch(e => {
                res.status(400).send({ message: e.message });
            });
    }

    delete(req, res) {
        RecieptCtrl.delete(req.params.id)
            .then(data => {
                res.status(200).send({ message: "success", data });
            })
            .catch(e => {
                res.status(400).send({ message: e.message });
            });
    }
}
