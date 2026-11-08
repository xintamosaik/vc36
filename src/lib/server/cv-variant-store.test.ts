import { describe, expect, it } from 'vitest';
import { isCvVariant } from './cv-variant-store.js';

const baseVariant = {
	id: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
	name: 'Variant',
	hiddenSections: [],
	sectionTitles: {},
	hiddenJobIds: [],
	skillChanges: {},
	addedSkills: []
};

describe('isCvVariant', () => {
	it('accepts existing variants and supported wording overrides', () => {
		expect(isCvVariant(baseVariant)).toBe(true);
		expect(
			isCvVariant({
				...baseVariant,
				textOverrides: {
					headerRole: 'Tailored role',
					headerSubtitle: 'Tailored introduction',
					summaryParagraphs: ['Tailored summary'],
					experienceBullets: { 'job-1': [{ content: 'Tailored wording', paragraph: true }] }
				}
			})
		).toBe(true);
	});

	it('rejects invalid wording override values', () => {
		expect(isCvVariant({ ...baseVariant, textOverrides: { headerRole: 123 } })).toBe(false);
		expect(
			isCvVariant({
				...baseVariant,
				textOverrides: { experienceBullets: { 'job-1': [{ content: 123 }] } }
			})
		).toBe(false);
	});
});
