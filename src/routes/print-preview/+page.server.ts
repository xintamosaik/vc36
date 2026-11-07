import { readCvData } from '#lib/server/cv-store.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => ({
	cv: await readCvData()
});
