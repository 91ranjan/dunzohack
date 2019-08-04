import StoreModel from '../model/StoreModel';
import * as logger from 'tracer';
import ProductModel from '../model/ProductModel';
const _console = logger.colorConsole;

export default class SearchCtrl {
    constructor() {
        if (!StoreModel._model) {
            StoreModel._initModel();
        }
    }

    async getAll(filters) {
        try {
            console.log(filters);
            if (filters.type === 'store_name') {
                return await StoreModel.getAll(filters);
            } else {
                return await ProductModel.searchAll(filters);
            }
        } catch (e) {
            throw new Error(e);
        }
    }

    async getCount(filters) {
        return await StoreModel.getCount(filters);
    }

    async getById(id) {
        return await StoreModel.getById(id);
    }

    async create(data) {
        return await StoreModel.create(data);
    }

    async update(data) {
        return await StoreModel.update(data);
    }

    async delete(id) {
        return await StoreModel.delete(id);
    }
}
