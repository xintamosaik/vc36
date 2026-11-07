import { error, json } from '@sveltejs/kit';
import { deleteCvVariant, isCvVariant, writeCvVariant } from '#lib/server/cv-variant-store.js';
import { verifyLocalRequest } from '#lib/server/verify-local-request.js';
import type { RequestHandler } from './$types';

export const PUT: RequestHandler = async (event) => {
	verifyLocalRequest(event);
	let value: unknown;
	try {
		value = await event.request.json();
	} catch (cause) {
		if (cause instanceof SyntaxError) error(400, 'Request body must be valid JSON');
		throw cause;
	}
	if (!isCvVariant(value) || value.id !== event.params.id) {
		error(400, 'Invalid CV variant data');
	}
	try {
		return json(await writeCvVariant(event.params.id, value));
	} catch (cause) {
		if (cause instanceof TypeError) error(400, cause.message);
		console.error(`Failed to save CV variant: ${event.params.id}`, cause);
		error(500, `Failed to save CV variant: ${event.params.id}`);
	}
};

export const DELETE: RequestHandler = async (event) => {
	verifyLocalRequest(event);
	let deleted: boolean;
	try {
		deleted = await deleteCvVariant(event.params.id);
	} catch (cause) {
		if (cause instanceof TypeError) error(400, cause.message);
		console.error(`Failed to delete CV variant: ${event.params.id}`, cause);
		error(500, `Failed to delete CV variant: ${event.params.id}`);
	}
	if (!deleted) error(404, 'CV variant not found');
	return json({ deleted: true });
};
