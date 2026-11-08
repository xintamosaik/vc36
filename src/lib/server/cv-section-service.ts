import { deletionBlockers } from '#lib/cv-references.js';
import type { CvData, CvSection } from '#lib/types/cv.js';
import { isCvSectionData, readCvData, writeCvSection } from './cv-store.js';
import { listCvVariants } from './cv-variant-store.js';
import { withCvWrite } from './cv-write.js';

export class ReferencedEntryError extends Error {}

export async function saveCvSection(section: CvSection, value: unknown): Promise<void> {
	if (!isCvSectionData(section, value))
		throw new TypeError(`Invalid data for CV section: ${section}`);
	return withCvWrite(async () => {
		if (section === 'experience' || section === 'skills') {
			const cv = await readCvData();
			const previous = section === 'experience' ? cv.experience.jobs : cv.skills.skills;
			const next =
				section === 'experience'
					? (value as CvData['experience']).jobs
					: (value as CvData['skills']).skills;
			const nextIds = new Set(next.map((item) => item.id));
			const removed = previous.filter((item) => !nextIds.has(item.id));
			if (removed.length) {
				const variants = await listCvVariants();
				for (const item of removed) {
					const blockers = deletionBlockers(variants, section, item.id);
					if (blockers.length) {
						const label = 'role' in item ? item.role || item.company : item.label;
						throw new ReferencedEntryError(
							`Cannot remove ${label || item.id}: referenced by ${blockers.map((variant) => variant.name).join(', ')}. Remove those references first.`
						);
					}
				}
			}
		}
		await writeCvSection(section, value);
	});
}
