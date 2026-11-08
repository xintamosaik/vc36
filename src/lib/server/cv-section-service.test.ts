import { beforeEach, expect, it, vi } from 'vitest';
import defaults from '#lib/data/cv/defaults.js';
import { readCvData, writeCvSection } from './cv-store.js';
import { listCvVariants } from './cv-variant-store.js';
import { ReferencedEntryError, saveCvSection } from './cv-section-service.js';
import type { CvVariant } from '#lib/types/cv.js';

vi.mock('./cv-store.js', async (original) => ({
	...(await original<typeof import('./cv-store.js')>()),
	readCvData: vi.fn(),
	writeCvSection: vi.fn()
}));
vi.mock('./cv-variant-store.js', () => ({ listCvVariants: vi.fn() }));

const variant: CvVariant = {
	id: 'variant',
	name: 'Application CV',
	hiddenSections: [],
	sectionTitles: {},
	hiddenJobIds: [],
	skillChanges: {},
	addedSkills: []
};

beforeEach(() => {
	vi.clearAllMocks();
	vi.mocked(readCvData).mockResolvedValue(structuredClone(defaults));
	vi.mocked(listCvVariants).mockResolvedValue([]);
	vi.mocked(writeCvSection).mockResolvedValue();
});

it('blocks a job removal before writing and identifies the dependent variant', async () => {
	vi.mocked(listCvVariants).mockResolvedValue([
		{
			...variant,
			textOverrides: { experienceBullets: { [defaults.experience.jobs[0].id]: [] } }
		}
	]);
	await expect(saveCvSection('experience', { ...defaults.experience, jobs: [] })).rejects.toThrow(
		'Application CV'
	);
	expect(writeCvSection).not.toHaveBeenCalled();
});

it('blocks removal of a skill hidden in a variant', async () => {
	vi.mocked(listCvVariants).mockResolvedValue([
		{
			...variant,
			skillChanges: { [defaults.skills.skills[0].id]: { kind: 'hidden' } }
		}
	]);
	await expect(saveCvSection('skills', { ...defaults.skills, skills: [] })).rejects.toBeInstanceOf(
		ReferencedEntryError
	);
	expect(writeCvSection).not.toHaveBeenCalled();
});

it('allows unreferenced deletion and editing or reordering referenced jobs', async () => {
	await saveCvSection('experience', { ...defaults.experience, jobs: [] });
	vi.mocked(listCvVariants).mockResolvedValue([
		{
			...variant,
			hiddenJobIds: [defaults.experience.jobs[0].id]
		}
	]);
	await saveCvSection('experience', {
		...defaults.experience,
		jobs: defaults.experience.jobs.toReversed().map((job) => ({ ...job, role: 'Edited' }))
	});
	expect(writeCvSection).toHaveBeenCalledTimes(2);
});

it('fails closed when references cannot be read, then permits a later retry', async () => {
	vi.mocked(listCvVariants).mockRejectedValueOnce(new Error('Unreadable variants'));
	await expect(saveCvSection('experience', { ...defaults.experience, jobs: [] })).rejects.toThrow(
		'Unreadable variants'
	);
	expect(writeCvSection).not.toHaveBeenCalled();
	await saveCvSection('experience', { ...defaults.experience, jobs: [] });
	expect(writeCvSection).toHaveBeenCalledTimes(1);
});
