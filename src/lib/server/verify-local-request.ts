import { error } from '@sveltejs/kit';

type LocalRequest = {
	getClientAddress: () => string;
	request: Request;
	url: URL;
};

function isLoopbackAddress(address: string): boolean {
	return address === '::1' || address.startsWith('127.') || address.startsWith('::ffff:127.');
}

export function verifyLocalRequest(event: LocalRequest): void {
	if (!isLoopbackAddress(event.getClientAddress())) {
		error(403, 'CV editing is only available from this machine');
	}

	const origin = event.request.headers.get('origin');
	if (origin && origin !== event.url.origin) {
		error(403, 'Cross-origin CV edits are not allowed');
	}
}
