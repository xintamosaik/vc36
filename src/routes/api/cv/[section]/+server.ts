import { error, json } from '@sveltejs/kit';
import { isCvSection, isCvSectionData, writeCvSection } from '#lib/server/cv-store.js';
import { verifyLocalRequest } from '#lib/server/verify-local-request.js';
import type { RequestHandler } from './$types';

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
