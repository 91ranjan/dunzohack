import * as mongoose from 'mongoose';
import * as logger from 'tracer';
const _console = logger.colorConsole;
import { getListFilters } from '../helpers/pageHelpers';

const Q = require('q');

const filterOpts = {
    like: ['name'],
};

class RecieptsModel {
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
                id: { type: String, required: true }, // unique for a store
                mobile: { type: String, required: true },
                store_name: { type: String, required: false },
                product_name: { type: String, required: false },
                address: { type: String, required: false },
                cgst: { type: String, required: false },
                sgst: { type: String, required: false },
                gstin: { type: String, required: false },
                variant: { type: String, required: false },
                price: { type: String, required: false },
                packaging: { type: String, required: false },
            },
            {
                timestamps: true,
                toObject: { virtuals: true },
                toJSON: { virtuals: true },
            }
        );
    }

    _initModel() {
        this._model = mongoose.model('reciepts', this._schema);
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
            .exec(function(err, docs) {
                if (err) {
                    console.log('Reciept.getAll : ' + err.message);
                    return deferred.reject(new Error(err));
                }
                return deferred.resolve(docs || {});
            });

        return deferred.promise;
    }

    getCount(filters) {
        var deferred = Q.defer();
        const { searchFilters } = getListFilters(filters, filterOpts);

        this._model.count(searchFilters).exec(function(err, docs) {
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
            .exec(function(err, docs) {
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

export default new RecieptsModel();
