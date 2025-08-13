function stringToUint8Array(binary: string): Uint8Array {
	const len = binary.length;
	const arr = new Uint8Array(len);
	for (let i = 0; i < len; i++) {
		arr[i] = binary.charCodeAt(i);
	}
	return arr;
}

export function fromBase64(data: string): Uint8Array {
	return stringToUint8Array(atob(data));
}
