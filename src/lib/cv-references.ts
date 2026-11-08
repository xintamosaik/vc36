import type { CvVariant } from '#lib/types/cv.js';

export function deletionBlockers(
	variants: CvVariant[],
	section: 'experience' | 'skills',
	id: string
): CvVariant[] {
	return variants.filter((variant) =>
		section === 'experience'
			? variant.hiddenJobIds.includes(id) ||
				Object.hasOwn(variant.textOverrides?.experienceBullets ?? {}, id)
			: Object.hasOwn(variant.skillChanges, id)
	);
}
