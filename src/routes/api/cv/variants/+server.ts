import { error, json } from '@sveltejs/kit';
import { createCvVariant, listCvVariants } from '#lib/server/cv-variant-store.js';
import { verifyLocalRequest } from '#lib/server/verify-local-request.js';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	try {
		return json(await listCvVariants());
	} catch (cause) {
		console.error('Failed to list CV variants', cause);
		error(500, 'Failed to list CV variants');
	}
};

export const POST: RequestHandler = async (event) => {
	verifyLocalRequest(event);
	let value: unknown;
	try {
		value = await event.request.json();
	} catch (cause) {
		if (cause instanceof SyntaxError) error(400, 'Request body must be valid JSON');
		throw cause;
	}
	if (
		typeof value !== 'object' ||
		value === null ||
		!('name' in value) ||
		typeof value.name !== 'string' ||
		value.name.trim().length === 0 ||
		value.name.length > 100
	) {
		error(400, 'A variant name is required');
	}
	try {
		return json(await createCvVariant(value.name), { status: 201 });
	} catch (cause) {
		console.error('Failed to create CV variant', cause);
		error(500, 'Failed to create CV variant');
	}
};
