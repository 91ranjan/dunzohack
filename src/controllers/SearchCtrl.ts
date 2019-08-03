import SearchsModel from '../model/RecieptsModel';
import * as logger from 'tracer';
const _console = logger.colorConsole;

export default class SearchCtrl {
    constructor() {
        if (!SearchsModel._model) {
            SearchsModel._initModel();
        }
    }

    async getAll(filters) {
        return await SearchsModel.getAll(filters);
    }

    async getCount(filters) {
        return await SearchsModel.getCount(filters);
    }

    async getById(id) {
        return await SearchsModel.getById(id);
    }

    async create(data) {
        return await SearchsModel.create(data);
    }

    async update(data) {
        return await SearchsModel.update(data);
    }

    async delete(id) {
        return await SearchsModel.delete(id);
    }
}
