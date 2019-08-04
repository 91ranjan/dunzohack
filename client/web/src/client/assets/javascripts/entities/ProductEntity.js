import {
    createGetAction,
    createSaveAction,
    createUpdateAction,
    createDeleteAction,
    createCreateLocalAction,
    createUpdateLocalAction,
    createDicardLocalAction,
} from 'utils/createActions';
// import Query from 'graphql-query-builder';

export const entity_name = 'product';
export const base_action = 'PRODUCT';

export const reducerConfig = {
    baseAction: base_action,
    basePath: ['data'],
};

export const entityActions = {
    get: createGetAction(
        payload => {
            return `/product`;
        },
        payload => payload.filters,
        {}
    ),
    getById: createGetAction(
        payload => {
            return `/product/` + payload.filters.id;
        },
        {},
        {}
    ),
    save: createSaveAction(
        payload => {
            return `/product`;
        },
        payload => payload.data,
        {}
    ),
    update: createUpdateAction(
        payload => {
            return `/product`;
        },
        payload => payload.data,
        {}
    ),
    delete: createDeleteAction(
        payload => {
            return `/product/${payload.filters.id}`;
        },
        payload => payload.data,
        {}
    ),

    createLocal: createCreateLocalAction(),
    updateLocal: createUpdateLocalAction(),
    discardLocal: createDicardLocalAction(),
};
