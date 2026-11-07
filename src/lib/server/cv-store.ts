import { randomUUID } from 'node:crypto';
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import defaults from '#lib/data/cv/defaults.js';
import { stringifyFatText } from '#lib/fat-text.js';
import type { CvData, CvSection, TextSegment } from '#lib/types/cv.js';

const dataDirectory = resolve(process.cwd(), 'data', 'cv');

const fileNames: Record<CvSection, string> = {
	header: 'header.json',
	commercialImpact: 'commercial-impact.json',
	summary: 'summary.json',
	experience: 'experience.json',
	skills: 'skills.json',
	education: 'education.json'
};

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isStringArray(value: unknown): value is string[] {
	return Array.isArray(value) && value.every((item) => typeof item === 'string');
}

function isTextSegment(value: unknown): value is TextSegment {
	return (
		typeof value === 'string' ||
		(isRecord(value) &&
			typeof value.text === 'string' &&
			(value.strong === undefined || typeof value.strong === 'boolean'))
	);
}

function isTextSegmentArray(value: unknown): value is TextSegment[] {
	return Array.isArray(value) && value.every(isTextSegment);
}

function normalizeCommercialImpact(value: unknown): unknown {
	if (!isRecord(value) || !Array.isArray(value.highlights)) return value;
	if (value.highlights.every((highlight) => typeof highlight === 'string')) return value;
	if (typeof value.title === 'string' && value.highlights.every(isTextSegmentArray)) {
		return {
			...value,
			highlights: value.highlights.map(stringifyFatText)
		};
	}
	return value;
}

function normalizeExperience(value: unknown): unknown {
	if (!isRecord(value) || !Array.isArray(value.jobs)) return value;
	return {
		...value,
		jobs: value.jobs.map((job) => {
			if (!isRecord(job) || !Array.isArray(job.bullets)) return job;
			return {
				...job,
				bullets: job.bullets.map((bullet) => {
					if (!isRecord(bullet) || !isTextSegmentArray(bullet.content)) return bullet;
					return {
						...bullet,
						content: stringifyFatText(bullet.content)
					};
				})
			};
		})
	};
}

export function isCvSection(value: string): value is CvSection {
	return Object.hasOwn(fileNames, value);
}

export function isCvSectionData(section: CvSection, value: unknown): boolean {
	if (!isRecord(value) || (section !== 'header' && typeof value.title !== 'string')) return false;

	switch (section) {
		case 'header':
			return (
				typeof value.name === 'string' &&
				typeof value.role === 'string' &&
				typeof value.subtitle === 'string' &&
				isStringArray(value.relocation) &&
				Array.isArray(value.links) &&
				value.links.every(
					(link) =>
						isRecord(link) &&
						typeof link.label === 'string' &&
						typeof link.href === 'string' &&
						(link.targetBlank === undefined || typeof link.targetBlank === 'boolean')
				)
			);
		case 'commercialImpact':
			return isStringArray(value.highlights);
		case 'summary':
			return isStringArray(value.paragraphs);
		case 'experience':
			return (
				Array.isArray(value.jobs) &&
				value.jobs.every(
					(job) =>
						isRecord(job) &&
						typeof job.role === 'string' &&
						typeof job.company === 'string' &&
						typeof job.dates === 'string' &&
						typeof job.location === 'string' &&
						Array.isArray(job.bullets) &&
						job.bullets.every(
							(bullet) =>
								isRecord(bullet) &&
								typeof bullet.content === 'string' &&
								(bullet.paragraph === undefined || typeof bullet.paragraph === 'boolean')
						)
				)
			);
		case 'skills':
			return (
				Array.isArray(value.skills) &&
				value.skills.every(
					(skill) =>
						isRecord(skill) && typeof skill.label === 'string' && typeof skill.value === 'string'
				)
			);
		case 'education':
			return (
				Array.isArray(value.entries) &&
				value.entries.every(
					(entry) =>
						isRecord(entry) &&
						typeof entry.qualification === 'string' &&
						typeof entry.institution === 'string' &&
						typeof entry.date === 'string' &&
						typeof entry.location === 'string' &&
						typeof entry.specialization === 'string'
				)
			);
	}
}

async function readSection<K extends CvSection>(section: K): Promise<CvData[K]> {
	const filePath = resolve(dataDirectory, fileNames[section]);
	let serialized: string;

	try {
		serialized = await readFile(filePath, 'utf8');
	} catch (cause) {
		if (isRecord(cause) && cause.code === 'ENOENT') return defaults[section];
		throw cause;
	}

	const parsed: unknown = JSON.parse(serialized);
	const value =
		section === 'commercialImpact'
			? normalizeCommercialImpact(parsed)
			: section === 'experience'
				? normalizeExperience(parsed)
				: parsed;
	if (!isCvSectionData(section, value)) {
		throw new Error(`Invalid CV data in ${filePath}`);
	}
	return value as CvData[K];
}

export async function readCvData(): Promise<CvData> {
	return {
		header: await readSection('header'),
		commercialImpact: await readSection('commercialImpact'),
		summary: await readSection('summary'),
		experience: await readSection('experience'),
		skills: await readSection('skills'),
		education: await readSection('education')
	};
}

export async function writeCvSection(section: CvSection, value: unknown): Promise<void> {
	if (!isCvSectionData(section, value)) {
		throw new TypeError(`Invalid data for CV section: ${section}`);
	}

	await mkdir(dataDirectory, { recursive: true });
	const filePath = resolve(dataDirectory, fileNames[section]);
	const temporaryPath = `${filePath}.${randomUUID()}.tmp`;
	await writeFile(temporaryPath, `${JSON.stringify(value, null, '\t')}\n`, {
		encoding: 'utf8',
		flag: 'wx'
	});
	await rename(temporaryPath, filePath);
}
