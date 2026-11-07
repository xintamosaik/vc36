export type TextSegment = string | { text: string; strong?: boolean };

export type CvHeader = {
	name: string;
	role: string;
	subtitle: string;
	relocation: string[];
	links: { label: string; href: string; targetBlank?: boolean }[];
};

export type CommercialImpact = {
	title: string;
	highlights: string[];
};

export type Summary = {
	title: string;
	paragraphs: string[];
};

export type ExperienceBullet = {
	content: string;
	paragraph?: boolean;
};

export type Job = {
	role: string;
	company: string;
	dates: string;
	location: string;
	bullets: ExperienceBullet[];
};

export type Experience = {
	title: string;
	jobs: Job[];
};

export type Skills = {
	title: string;
	skills: { label: string; value: string }[];
};

export type Education = {
	title: string;
	entries: {
		qualification: string;
		institution: string;
		date: string;
		location: string;
		specialization: string;
	}[];
};

export type CvData = {
	header: CvHeader;
	commercialImpact: CommercialImpact;
	summary: Summary;
	experience: Experience;
	skills: Skills;
	education: Education;
};

export type CvSection = keyof CvData;
