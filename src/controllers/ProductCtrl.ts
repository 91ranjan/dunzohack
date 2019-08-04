import * as logger from 'tracer';
import ProductModel from '../model/ProductModel';
const _console = logger.colorConsole;

export default class ProductCtrl {

    async getAll(filters) {
        try {
            return await ProductModel.getAll(filters);
        } catch (e) {
            console.log(e);
            throw new Error(e);
        }
    }

    async getCount(filters) {
        return await ProductModel.getCount(filters);
    }

    async getById(id) {
        return await ProductModel.getById(id);
    }

    async create(data) {
        return await ProductModel.create(data);
    }

    async update(data) {
        return await ProductModel.update(data);
    }

    async delete(id) {
        return await ProductModel.delete(id);
    }
}
