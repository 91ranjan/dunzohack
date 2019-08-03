import UsersModel from '../model/UsersModel';
import * as logger from 'tracer';
const _console = logger.colorConsole;

export default class UserCtrl {
    constructor() {
        if (!UsersModel._model) {
            UsersModel._initModel();
        }
    }

    async getAll(filters) {
        return await UsersModel.getAll(filters);
    }

    async getCount(filters) {
        return await UsersModel.getCount(filters);
    }

    async getById(id) {
        return await UsersModel.getById(id);
    }

    async create(data) {
        return await UsersModel.create(data);
    }

    async update(data) {
        return await UsersModel.update(data);
    }

    async delete(id) {
        return await UsersModel.delete(id);
    }
}
