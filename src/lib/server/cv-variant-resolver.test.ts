import { describe, expect, it } from 'vitest';
import type { CvData, CvVariant } from '#lib/types/cv.js';
import { resolveCvVariant } from './cv-variant-resolver.js';

const mainCv: CvData = {
	header: { name: 'Name', role: 'Role', subtitle: '', relocation: [], links: [] },
	commercialImpact: { title: 'Impact', highlights: [] },
	summary: { title: 'Summary', paragraphs: [] },
	experience: {
		title: 'Experience',
		jobs: [
			{
				id: 'job-1',
				role: 'Engineer',
				company: 'Company',
				dates: '',
				location: '',
				bullets: []
			}
		]
	},
	skills: {
		title: 'Skills',
		skills: [{ id: 'skill-1', label: 'Languages', value: 'TypeScript, JavaScript' }]
	},
	education: { title: 'Education', entries: [] }
};

const emptyVariant: CvVariant = {
	id: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
	name: 'Variant',
	hiddenSections: [],
	sectionTitles: {},
	hiddenJobIds: [],
	skillChanges: {},
	addedSkills: []
};

describe('resolveCvVariant', () => {
	it('preserves the main CV for an empty overlay', () => {
		expect(resolveCvVariant(mainCv, emptyVariant)).toEqual(mainCv);
	});

	it('applies section-title overrides and removes hidden jobs', () => {
		const resolved = resolveCvVariant(mainCv, {
			...emptyVariant,
			hiddenSections: ['commercialImpact'],
			sectionTitles: { experience: 'Selected work' },
			hiddenJobIds: ['job-1']
		});

		expect(resolved.experience.title).toBe('Selected work');
		expect(resolved.experience.jobs).toEqual([]);
		expect(resolved.commercialImpact).toEqual(mainCv.commercialImpact);
	});

	it('hides, replaces, and adds complete skill rows without mutating main data', () => {
		const resolved = resolveCvVariant(mainCv, {
			...emptyVariant,
			skillChanges: {
				'skill-1': { kind: 'replacement', label: 'Languages', value: 'TypeScript' }
			},
			addedSkills: [{ id: 'skill-2', label: 'Cloud', value: 'AWS' }]
		});

		expect(resolved.skills.skills).toEqual([
			{ id: 'skill-1', label: 'Languages', value: 'TypeScript' },
			{ id: 'skill-2', label: 'Cloud', value: 'AWS' }
		]);
		expect(mainCv.skills.skills[0].value).toBe('TypeScript, JavaScript');
	});

	it('hides inherited skill rows', () => {
		const resolved = resolveCvVariant(mainCv, {
			...emptyVariant,
			skillChanges: { 'skill-1': { kind: 'hidden' } }
		});
		expect(resolved.skills.skills).toEqual([]);
	});

	it('rejects stale job and skill references explicitly', () => {
		expect(() =>
			resolveCvVariant(mainCv, { ...emptyVariant, hiddenJobIds: ['missing-job'] })
		).toThrow('Variant references unknown job');
		expect(() =>
			resolveCvVariant(mainCv, {
				...emptyVariant,
				skillChanges: { 'missing-skill': { kind: 'hidden' } }
			})
		).toThrow('Variant references unknown skill row');
	});
});
