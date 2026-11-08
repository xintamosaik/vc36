import { randomUUID } from 'node:crypto';
import { mkdir, readFile, readdir, rename, unlink, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import type { CvData, CvSection, CvVariant, CvVariantSkillChange } from '#lib/types/cv.js';
import { readCvData } from '#lib/server/cv-store.js';
import { resolveCvVariant } from '#lib/server/cv-variant-resolver.js';
import { withCvWrite } from './cv-write.js';

const variantsDirectory = resolve(process.cwd(), 'data', 'cv', 'variants');
const idPattern = /^[\da-f]{8}-[\da-f]{4}-[1-8][\da-f]{3}-[89ab][\da-f]{3}-[\da-f]{12}$/i;
const sections = ['header', 'commercialImpact', 'summary', 'experience', 'skills', 'education'];
const titledSections = ['commercialImpact', 'summary', 'experience', 'skills', 'education'];

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isStringArray(value: unknown): value is string[] {
	return Array.isArray(value) && value.every((item) => typeof item === 'string');
}

function isSkill(value: unknown): value is { id: string; label: string; value: string } {
	return (
		isRecord(value) &&
		typeof value.id === 'string' &&
		value.id.length > 0 &&
		typeof value.label === 'string' &&
		typeof value.value === 'string'
	);
}

function isExperienceBullet(value: unknown): boolean {
	return (
		isRecord(value) &&
		typeof value.content === 'string' &&
		(value.paragraph === undefined || typeof value.paragraph === 'boolean')
	);
}

export function isCvVariant(value: unknown): value is CvVariant {
	if (
		!isRecord(value) ||
		typeof value.id !== 'string' ||
		!idPattern.test(value.id) ||
		typeof value.name !== 'string' ||
		value.name.trim().length === 0 ||
		value.name.length > 100 ||
		!isStringArray(value.hiddenSections) ||
		!value.hiddenSections.every((section) => sections.includes(section)) ||
		new Set(value.hiddenSections).size !== value.hiddenSections.length ||
		!isRecord(value.sectionTitles) ||
		!Object.entries(value.sectionTitles).every(
			([section, title]) => titledSections.includes(section) && typeof title === 'string'
		) ||
		!isStringArray(value.hiddenJobIds) ||
		!value.hiddenJobIds.every((id) => id.length > 0) ||
		new Set(value.hiddenJobIds).size !== value.hiddenJobIds.length ||
		!isRecord(value.skillChanges) ||
		!Object.keys(value.skillChanges).every((id) => id.length > 0) ||
		!Array.isArray(value.addedSkills) ||
		!value.addedSkills.every(isSkill) ||
		(value.textOverrides !== undefined &&
			(!isRecord(value.textOverrides) ||
				(value.textOverrides.headerRole !== undefined &&
					typeof value.textOverrides.headerRole !== 'string') ||
				(value.textOverrides.headerSubtitle !== undefined &&
					typeof value.textOverrides.headerSubtitle !== 'string') ||
				(value.textOverrides.summaryParagraphs !== undefined &&
					!isStringArray(value.textOverrides.summaryParagraphs)) ||
				(value.textOverrides.experienceBullets !== undefined &&
					(!isRecord(value.textOverrides.experienceBullets) ||
						!Object.entries(value.textOverrides.experienceBullets).every(
							([jobId, bullets]) =>
								jobId.length > 0 && Array.isArray(bullets) && bullets.every(isExperienceBullet)
						)))))
	) {
		return false;
	}

	const skillIds = value.addedSkills.map((skill) => skill.id);
	if (new Set(skillIds).size !== skillIds.length) return false;
	return Object.values(value.skillChanges).every(
		(change): change is CvVariantSkillChange =>
			isRecord(change) &&
			(change.kind === 'hidden' ||
				(change.kind === 'replacement' &&
					typeof change.label === 'string' &&
					typeof change.value === 'string'))
	);
}

function variantPath(id: string): string {
	if (!idPattern.test(id)) throw new TypeError('Invalid CV variant ID');
	return resolve(variantsDirectory, `${id}.json`);
}

async function writeAtomic(filePath: string, value: unknown): Promise<void> {
	await mkdir(variantsDirectory, { recursive: true });
	const temporaryPath = `${filePath}.${randomUUID()}.tmp`;
	await writeFile(temporaryPath, `${JSON.stringify(value, null, '\t')}\n`, {
		encoding: 'utf8',
		flag: 'wx'
	});
	await rename(temporaryPath, filePath);
}

export async function listCvVariants(): Promise<CvVariant[]> {
	let names: string[];
	try {
		names = await readdir(variantsDirectory);
	} catch (cause) {
		if (isRecord(cause) && cause.code === 'ENOENT') return [];
		throw cause;
	}

	const jsonNames = names.filter((name) => name.endsWith('.json'));
	if (jsonNames.some((name) => !idPattern.test(name.slice(0, -5)))) {
		throw new Error('Invalid CV variant filename in variants directory');
	}
	const variants = await Promise.all(
		jsonNames.map(async (name) => {
			const value: unknown = JSON.parse(await readFile(resolve(variantsDirectory, name), 'utf8'));
			if (!isCvVariant(value) || `${value.id}.json` !== name) {
				throw new Error(`Invalid CV variant data in ${name}`);
			}
			return value;
		})
	);
	return variants.sort((a, b) => a.name.localeCompare(b.name));
}

export async function readCvVariant(id: string): Promise<CvVariant | null> {
	if (!idPattern.test(id)) return null;
	let value: unknown;
	try {
		value = JSON.parse(await readFile(variantPath(id), 'utf8'));
	} catch (cause) {
		if (isRecord(cause) && cause.code === 'ENOENT') return null;
		throw cause;
	}
	if (!isCvVariant(value) || value.id !== id) {
		throw new Error(`Invalid CV variant data for ${id}`);
	}
	return value;
}

export async function createCvVariant(name: string): Promise<CvVariant> {
	if (name.trim().length === 0 || name.length > 100) {
		throw new TypeError('Variant name must be between 1 and 100 characters');
	}
	const variant: CvVariant = {
		id: randomUUID(),
		name: name.trim(),
		hiddenSections: [],
		sectionTitles: {},
		hiddenJobIds: [],
		skillChanges: {},
		addedSkills: [],
		textOverrides: {}
	};
	await writeAtomic(variantPath(variant.id), variant);
	return variant;
}

export async function writeCvVariant(id: string, value: unknown): Promise<CvVariant> {
	if (!isCvVariant(value) || value.id !== id) throw new TypeError('Invalid CV variant data');
	if (value.addedSkills.some((skill) => !skill.label.trim() || !skill.value.trim())) {
		throw new TypeError('Each added skill row needs both a label and skill content');
	}
	if (
		Object.values(value.skillChanges).some(
			(change) => change.kind === 'replacement' && (!change.label.trim() || !change.value.trim())
		)
	) {
		throw new TypeError('Each replacement skill row needs both a label and skill content');
	}
	return withCvWrite(async () => {
		const mainCv = await readCvData();
		resolveCvVariant(mainCv, value);
		await writeAtomic(variantPath(id), value);
		return value;
	});
}

export async function deleteCvVariant(id: string): Promise<boolean> {
	try {
		await unlink(variantPath(id));
		return true;
	} catch (cause) {
		if (isRecord(cause) && cause.code === 'ENOENT') return false;
		throw cause;
	}
}

export async function resolveCvVariantData(id: string): Promise<{
	cv: CvData;
	hiddenSections: CvSection[];
	variant: CvVariant;
} | null> {
	const variant = await readCvVariant(id);
	if (!variant) return null;
	return {
		cv: resolveCvVariant(await readCvData(), variant),
		hiddenSections: variant.hiddenSections,
		variant
	};
}
