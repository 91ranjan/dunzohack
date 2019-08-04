import * as mongoose from 'mongoose';
import * as mongoosastic from 'mongoosastic';
import * as logger from 'tracer';
const _console = logger.colorConsole;
import { getListFilters } from '../helpers/pageHelpers';
const Schema = mongoose.Schema;

const Q = require('q');

const filterOpts = {
    like: ['name'],
};

class ProductModel {
    _schema;
    _model;
    constructor() {
        this._init();
    }
    _init() {
        this._defineSchema();
        this._initModel();
    }

    _defineSchema() {
        this._schema = new mongoose.Schema(
            {
                product_name: { type: String, required: false, es_indexed: true },
                price: { type: String, required: false },
                store: { type: Schema.Types.ObjectId, ref: 'stores' },
            },
            {
                timestamps: true,
                toObject: { virtuals: true },
                toJSON: { virtuals: true },
            }
        );
        this._schema.plugin(mongoosastic, {
            hosts: ['localhost:9200']
        });
    }

    _initModel() {
        this._model = mongoose.model('products', this._schema);
        this._model.createMapping(function (err, mapping) {
            if (err) {
                // console.log('error creating mapping (you can safely ignore this)');
                console.log(err);
            } else {
                console.log('mapping created!');
                console.log(mapping);
            }
        });
        this._model.synchronize();
    }

    getAll(filters) {
        var deferred = Q.defer();
        const { searchFilters, pageFilters } = getListFilters(filters, filterOpts);
        this._model
            .find(searchFilters)
            .limit(pageFilters.limit)
            .skip(pageFilters.offset)
            .sort({ createdAt: -1 })
            // .populate({
            //     path:'usecases.usecase_ref',
            //     model: 'usecases',
            // })
            .populate('release')
            .exec(function (err, docs) {
                if (err) {
                    console.log('Reciept.getAll : ' + err.message);
                    return deferred.reject(new Error(err));
                }
                return deferred.resolve(docs || {});
            });
        return deferred.promise;
    }

    searchAll(filters) {
        var deferred = Q.defer();
        const { searchFilters, pageFilters } = getListFilters(filters, filterOpts);
        // console.log(searchFilters.q);
        this._model.search({ query_string: { query: searchFilters.q } }, { hydrate: true }, function (err, results) {
            if (err) {
                console.log('Reciept.getAll : ' + err.message);
                return deferred.reject(new Error(err));
            }
            // console.log(results);
            return deferred.resolve(results.hits.hits || {});
        })
        /*this._model
            .find(searchFilters)
            .limit(pageFilters.limit)
            .skip(pageFilters.offset)
            .sort({ createdAt: -1 })
            // .populate({
            //     path:'usecases.usecase_ref',
            //     model: 'usecases',
            // })
            .populate('release')
            .exec(function(err, docs) {
                if (err) {
                    console.log('Reciept.getAll : ' + err.message);
                    return deferred.reject(new Error(err));
                }
                return deferred.resolve(docs || {});
            });*/

        return deferred.promise;
    }

    getCount(filters) {
        var deferred = Q.defer();
        const { searchFilters } = getListFilters(filters, filterOpts);

        this._model.count(searchFilters).exec(function (err, docs) {
            if (err) {
                console.error(err);
                return deferred.reject(new Error(err));
            }
            return deferred.resolve(docs);
        });

        return deferred.promise;
    }

    getById(id) {
        var deferred = Q.defer();
        this._model
            .findOne({ _id: id })
            .populate({
                path: 'usecases.usecase_ref',
                model: 'usecases',
                populate: {
                    path: 'release',
                    model: 'releases',
                },
            })
            .populate('release')
            .exec(function (err, docs) {
                if (err) {
                    console.log('Reciept.getById : ' + err.message);
                    return deferred.reject(new Error(err));
                }
                return deferred.resolve(docs || {});
            });

        return deferred.promise;
    }

    create(data) {
        var deferred = Q.defer();

        this._model.create(data, (err, doc) => {
            if (err) {
                return deferred.reject(new Error(err));
            }
            deferred.resolve(doc);
        });

        return deferred.promise;
    }

    update(data) {
        var deferred = Q.defer();
        this._model
            .findOneAndUpdate({ _id: data._id }, data, { new: true })
            .exec((err, doc) => {
                if (err) {
                    return deferred.reject(new Error(err));
                }
                deferred.resolve(doc);
            });

        return deferred.promise;
    }

    delete(id) {
        var deferred = Q.defer();

        this._model.findOneAndRemove({ _id: id }, (err, doc) => {
            if (err) {
                return deferred.reject(new Error(err));
            }
            deferred.resolve(doc);
        });

        return deferred.promise;
    }
}

export default new ProductModel();
