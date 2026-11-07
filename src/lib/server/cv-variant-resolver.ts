import type { CvData, CvSection, CvVariant } from '#lib/types/cv.js';

export function resolveCvVariant(cv: CvData, variant: CvVariant): CvData {
	const result = structuredClone(cv);
	const jobIds = new Set(cv.experience.jobs.map((job) => job.id));
	const skillIds = new Set(cv.skills.skills.map((skill) => skill.id));

	for (const jobId of variant.hiddenJobIds) {
		if (!jobIds.has(jobId)) throw new TypeError(`Variant references unknown job: ${jobId}`);
	}
	for (const skillId of Object.keys(variant.skillChanges)) {
		if (!skillIds.has(skillId))
			throw new TypeError(`Variant references unknown skill row: ${skillId}`);
	}
	for (const skill of variant.addedSkills) {
		if (skillIds.has(skill.id)) {
			throw new TypeError(`Variant skill ID conflicts with a main CV row: ${skill.id}`);
		}
	}

	result.experience.jobs = result.experience.jobs.filter(
		(job) => !variant.hiddenJobIds.includes(job.id)
	);
	result.skills.skills = result.skills.skills.flatMap((skill) => {
		const change = variant.skillChanges[skill.id];
		if (!change) return [skill];
		if (change.kind === 'hidden') return [];
		return [{ ...skill, label: change.label, value: change.value }];
	});
	result.skills.skills.push(...structuredClone(variant.addedSkills));

	for (const section of Object.keys(variant.sectionTitles) as Exclude<CvSection, 'header'>[]) {
		result[section].title = variant.sectionTitles[section] ?? result[section].title;
	}

	return result;
}
