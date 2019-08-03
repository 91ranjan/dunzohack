import { Response, Request, NextFunction } from 'express';

export const getListFilters = ({ limit, page = 1, ...filters }, opts) => {
    opts = opts || {};
    const pagelimit = limit ? parseInt(limit, 10) : 20;
    if (opts.like) {
        Object.keys(filters).forEach(key => {
            if (opts.like.indexOf(key) > -1) {
                filters[key] = { $regex: filters[key], $options: 'i' };
            }
            if (Array.isArray(filters[key]) && !['$and', '$or'].includes(key)) {
                filters[key] = { $in: filters[key] };
            }
        });
    }

    return {
        pageFilters: {
            limit: pagelimit,
            offset: (page - 1) * pagelimit,
        },
        searchFilters: filters,
    };
};
