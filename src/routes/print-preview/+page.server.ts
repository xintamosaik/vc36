import { error } from '@sveltejs/kit';
import { readCvData } from '#lib/server/cv-store.js';
import { resolveCvVariantData } from '#lib/server/cv-variant-store.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const variantId = url.searchParams.get('variant');
	if (!variantId) return { cv: await readCvData(), hiddenSections: [], variantId: null };
	try {
		const resolved = await resolveCvVariantData(variantId);
		if (!resolved) error(404, 'CV variant not found');
		return {
			cv: resolved.cv,
			hiddenSections: resolved.hiddenSections,
			variantId: resolved.variant.id
		};
	} catch (cause) {
		if (cause && typeof cause === 'object' && 'status' in cause && cause.status === 404)
			throw cause;
		error(409, cause instanceof Error ? cause.message : 'Could not resolve CV variant');
	}
};
