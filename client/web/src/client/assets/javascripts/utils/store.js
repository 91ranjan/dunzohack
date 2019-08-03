export const serializeFilter = (filters) => {
    if (!filters) {
        return '';
    }
	let filterString = '';
	const keys = Object.keys(filters);
	keys.forEach((key, index) => {
		filterString += key + '=' + filters[key];
		if (index + 1 < keys.length) {
			filterString += '&';
		}
	});
	return filterString;
}
