import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt-nodejs';
import { getListFilters } from '../helpers/pageHelpers';

const Q = require('q');

const filterOpts = {
    like: ['name'],
};

const generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

class UsersModel {
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
                first_name: { type: String, required: false },
                last_name: { type: String, required: false },
                email: { type: String, required: false, unique: true },
                password: { type: String, required: false },
                mobile: { type: String, required: false },
                type: { type: Number, required: false, default: 1 },
            },
            {
                timestamps: true,
                toObject: { virtuals: true },
                toJSON: { virtuals: true },
            }
        );
        this._schema.virtual('fullname').get(function () {
            return [this.first_name, this.last_name].filter(Boolean).join(' ');
        });
        this._schema.methods.getUsername = function() {
            return this.local.email;
        };
        this._schema.methods.getPassword = function() {
            return this.local.password;
        };
        this._schema.methods.validPassword = function(password) {
            return bcrypt.compareSync(password, this.password);
        };
        this._schema.methods.getPublicFields = function() {
            var returnObject = {
                first_name: this.first_name,
                id: this._id,
                _id: this._id,
                last_name: this.last_name,
                email: this.email,
                mobile: this.mobile,
            };
            return returnObject;
        };
    }

    _initModel() {
        this._model = mongoose.model('users', this._schema);
    }

    getAll(filters) {
        var deferred = Q.defer();
        const { searchFilters, pageFilters } = getListFilters(filters, filterOpts);

        this._model
            .find(searchFilters)
            .limit(pageFilters.limit)
            .skip(pageFilters.offset)
            .sort({ createdAt: -1 })
            .select('-password')
            .exec(function(err, docs) {
                if (err) {
                    console.log('Features.getAll : ' + err.message);
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
            .select('-password')
            .exec(function(err, docs) {
                if (err) {
                    console.log('Features.getById : ' + err.message);
                    return deferred.reject(new Error(err));
                }
                return deferred.resolve(docs || {});
            });

        return deferred.promise;
    }

    getByEmail(email) {
        var deferred = Q.defer();
        this._model.findOne({ email }).exec(function(err, docs) {
            if (err) {
                console.log('Features.getById : ' + err.message);
                return deferred.reject(new Error(err));
            }
            return deferred.resolve(docs);
        });

        return deferred.promise;
    }

    create(data) {
        const deferred = Q.defer();
        const { first_name, last_name, email, password, mobile } = data;
        const newUser = new this._model({
            first_name,
            last_name,
            email,
            password: generateHash(password),
            mobile,
        });

        newUser.save((err, user) => {
            if (err) {
                console.log('Failed to save user.');
                return deferred.reject(new Error(err));
            }
            return deferred.resolve(user.getPublicFields());
        });

        return deferred.promise;
    }

    update(data) {
        if (data.password) {
            data.password = generateHash(data.password);
        }
        var deferred = Q.defer();
        this._model
            .findOneAndUpdate({ _id: data._id }, data, { new: true })
            .select('-password')
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

export default new UsersModel();
