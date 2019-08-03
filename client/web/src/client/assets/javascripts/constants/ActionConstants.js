import keymirror from 'utils/keymirror';

export const BASE_ACTIONS_TYPES = keymirror(
	'CREATE',
	'GET',
	'POST',
	'UPDATE',
	'DELETE',
	'STALE',
	'INVALIDATE',
	'DISCARD',
);

export const ACTION_STATES = keymirror(
	'LOCAL',
	'SUCCESS',
	'FAILURE',
	'PENDING'
);
