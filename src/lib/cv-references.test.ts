import { expect, it } from 'vitest';
import { deletionBlockers } from './cv-references.js';
import type { CvVariant } from './types/cv.js';

const variant: CvVariant = {
	id: 'variant',
	name: 'Tailored CV',
	hiddenSections: [],
	sectionTitles: {},
	hiddenJobIds: [],
	skillChanges: {},
	addedSkills: []
};

it('finds explicit hidden-job and wording references, including empty wording', () => {
	const hidden = { ...variant, hiddenJobIds: ['job'] };
	const wording = { ...variant, textOverrides: { experienceBullets: { job: [] } } };
	expect(deletionBlockers([hidden, wording, variant], 'experience', 'job')).toEqual([
		hidden,
		wording
	]);
});

it('finds both hidden and replacement skill references', () => {
	const hidden: CvVariant = { ...variant, skillChanges: { skill: { kind: 'hidden' } } };
	const replacement: CvVariant = {
		...variant,
		skillChanges: { skill: { kind: 'replacement', label: 'Stack', value: 'TS' } }
	};
	expect(deletionBlockers([hidden, replacement], 'skills', 'skill')).toEqual([hidden, replacement]);
	expect(deletionBlockers([hidden, replacement], 'experience', 'skill')).toEqual([]);
});

it('allows deletion without explicit references and counts each variant once', () => {
	expect(deletionBlockers([variant], 'experience', 'job')).toEqual([]);
	expect(
		deletionBlockers(
			[
				{
					...variant,
					hiddenJobIds: ['job'],
					textOverrides: { experienceBullets: { job: [] } }
				}
			],
			'experience',
			'job'
		)
	).toHaveLength(1);
});
