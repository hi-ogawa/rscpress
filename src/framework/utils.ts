function stringToUint8Array(binary: string): Uint8Array<ArrayBuffer> {
	const len = binary.length;
	const arr = new Uint8Array(len);
	for (let i = 0; i < len; i++) {
		arr[i] = binary.charCodeAt(i);
	}
	return arr;
}

export function fromBase64(data: string): Uint8Array<ArrayBuffer> {
	return stringToUint8Array(atob(data));
}

export function toSingleReadableStream<T>(data: T): ReadableStream<T> {
	return new ReadableStream({
		start(controller) {
			controller.enqueue(data);
			controller.close();
		},
	});
}
