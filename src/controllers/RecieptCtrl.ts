import SearchsModel from '../model/StoreModel';
import * as logger from 'tracer';
import * as rimraf from 'rimraf';
import { main } from '../../client/jsparser/textparser'
import { parseReciept, parseRecieptLines } from '../utils/recieptHelpers';
import StoreModel from '../model/StoreModel';
import ProductModel from '../model/ProductModel';
import JsonApi from '../utils/JsonApi';
const request = new JsonApi();

async function asyncForEach(array, callback) {
    let returns = [];
    for (let index = 0; index < array.length; index++) {
        returns.push(await callback(array[index], index, array));
    }
    return returns;
}

export default class RecieptCtrl {
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
        const parsedRecieptLines = [];
        let parsedData;
        try {
            const resps = await main('uploads/');
            parsedRecieptLines.push(parseReciept(resps[0]))
            parsedData = parseRecieptLines(parsedRecieptLines[0]);

            rimraf('uploads/*', function () { console.log('done'); });
            return await this.saveData(parsedData)
        } catch (e) {
            console.log(e);
            throw e;
        }
    }

    async analyze() {
        const parsedRecieptLines = [];
        let parsedData;
        try {
            const resps = await main('client/jsparser/all_images/');
            parsedRecieptLines.push(parseReciept(resps[0]))
            parsedData = parseRecieptLines(parsedRecieptLines[0]);

            return await this.saveData(parsedData)
        } catch (e) {
            console.log(e);
            throw e;
        }
    }

    async saveData(parsedData) {
        let getPlace = await request.get('https://maps.googleapis.com/maps/api/place/findplacefromtext/json?',
            { 'input': parsedData.store_name, 'key': 'AIzaSyAgignnY-gj4j_S7IFlIp8bx1Lfm14E2lM', 'inputtype': 'textquery' }, {})
        getPlace = JSON.parse(getPlace.text)
        const placeId = getPlace['candidates'][0]['place_id'];
        let getPlaceDetails = await request.get('https://maps.googleapis.com/maps/api/place/details/json?',
            { 'placeid': placeId, 'key': 'AIzaSyAgignnY-gj4j_S7IFlIp8bx1Lfm14E2lM', 'inputtype': 'textquery', 'fields': 'type' }, {})
        getPlaceDetails = JSON.parse(getPlaceDetails.text)
        parsedData.categories = getPlaceDetails.result.types;

        const store = await StoreModel.create(parsedData);
        await asyncForEach(parsedData.products, async product => {
            product.store = store._id;
            console.log(product);
            await ProductModel.create(product)

        })
        return store;
    }

    async update(data) {
        return await SearchsModel.update(data);
    }

    async delete(id) {
        return await SearchsModel.delete(id);
    }
}
