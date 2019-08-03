export const _asyncForEach = async function(array, callback) {
    let returns = [];
    for (let index = 0; index < array.size; index++) {
        returns.push(await callback(array.get(index), index, array));
    }
    return returns;
};

export const asyncForEach = async function(array, callback) {
    let returns = [];
    for (let index = 0; index < array.length; index++) {
        returns.push(await callback(array[index], index, array));
    }
    return returns;
};
