import { json } from '@sveltejs/kit';
import { readCvData } from '#lib/server/cv-store.js';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	try {
		return json(await readCvData());
	} catch (cause) {
		console.error('Failed to read CV data', cause);
		return json({ message: 'Failed to read CV data' }, { status: 500 });
	}
};
