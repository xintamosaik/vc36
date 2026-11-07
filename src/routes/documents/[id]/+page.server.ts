import { error } from '@sveltejs/kit';
import { readCvData } from '#lib/server/cv-store.js';
import { readCvVariant } from '#lib/server/cv-variant-store.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const variant = await readCvVariant(params.id);
	if (!variant) error(404, 'CV variant not found');
	return { cv: await readCvData(), variant };
};
