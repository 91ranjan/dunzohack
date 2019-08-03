export default function keymirror() {
	let mirrorObj = {};
	Object.values(arguments).forEach((key)=> {
		mirrorObj[key] = key;
	});
	return mirrorObj;
}