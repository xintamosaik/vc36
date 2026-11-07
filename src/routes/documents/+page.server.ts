import { listCvVariants } from '#lib/server/cv-variant-store.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => ({
	variants: await listCvVariants()
});
