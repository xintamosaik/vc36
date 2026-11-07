import { error, json } from '@sveltejs/kit';
import { isCvSection, isCvSectionData, writeCvSection } from '#lib/server/cv-store.js';
import type { RequestHandler } from './$types';

function isLoopbackAddress(address: string): boolean {
	return address === '::1' || address.startsWith('127.') || address.startsWith('::ffff:127.');
}

function verifyLocalRequest(event: Parameters<RequestHandler>[0]): void {
	if (!isLoopbackAddress(event.getClientAddress())) {
		error(403, 'CV editing is only available from this machine');
	}

	const origin = event.request.headers.get('origin');
	if (origin && origin !== event.url.origin) {
		error(403, 'Cross-origin CV edits are not allowed');
	}
}

export const PUT: RequestHandler = async (event) => {
	verifyLocalRequest(event);
	const sectionName = event.params.section;
	if (!isCvSection(sectionName)) error(404, 'Unknown CV section');

	let value: unknown;
	try {
		value = await event.request.json();
	} catch (cause) {
		if (cause instanceof SyntaxError) error(400, 'Request body must be valid JSON');
		throw cause;
	}

	if (!isCvSectionData(sectionName, value)) error(400, `Invalid data for section: ${sectionName}`);

	try {
		await writeCvSection(sectionName, value);
		return json({ saved: true });
	} catch (cause) {
		console.error(`Failed to save CV section: ${sectionName}`, cause);
		error(500, `Failed to save CV section: ${sectionName}`);
	}
};
