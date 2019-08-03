import * as express from "express";
import { parallel } from "async";

import { client } from "../../index";
import SearchController from "../controllers/SearchCtrl";
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
    this.router.get("/", this.get);
    this.router.get("/:id", this.getById);
    this.router.post("/", this.create);
    this.router.put("/", this.update);
    this.router.delete("/:id", this.delete);
  }

  search(req, res) {
    // declare the query object to search elastic search and return only 200 results from the first result found.
    // also match any data where the name is like the query string sent in
    let body = {
      size: 200,
      from: 0,
      query: {
        match: {
            "store_name" : "ABC"
        }
      }
    };
    // perform the actual search passing in the index, the search query and the type
    client
      .search({ index: "store-name", body: body, type: "Reciepts" })
      .then(results => {
        console.log(results.hits.hits)  
        res.send(results.hits.hits);
      })
      .catch(err => {
        console.log(err);
        res.send([]);
      });
  }

  get(req, res) {
    const promises = [
      SearchCtrl.getAll(req.query),
      SearchCtrl.getCount(req.query)
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
    SearchCtrl.getById(req.params.id)
      .then(data => {
        res
          .status(200)
          .send({ message: "success", data, totalRecords: data.length });
      })
      .catch(e => {
        res.status(400).send({ message: e.message });
      });
  }

  create(req, res) {
    SearchCtrl.create(req.body)
      .then(data => {
        res.status(200).send({ message: "success", data });
      })
      .catch(e => {
        res.status(400).send({ message: e.message });
      });
  }

  update(req, res) {
    SearchCtrl.update(req.body)
      .then(data => {
        res.status(200).send({ message: "success", data });
      })
      .catch(e => {
        res.status(400).send({ message: e.message });
      });
  }

  delete(req, res) {
    SearchCtrl.delete(req.params.id)
      .then(data => {
        res.status(200).send({ message: "success", data });
      })
      .catch(e => {
        res.status(400).send({ message: e.message });
      });
  }
}
