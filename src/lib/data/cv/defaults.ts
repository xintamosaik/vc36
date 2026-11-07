import commercialImpact from './commercial-impact.json';
import education from './education.json';
import experience from './experience.json';
import header from './header.json';
import skills from './skills.json';
import summary from './summary.json';
import type { CvData } from '#lib/types/cv.js';

const cvDefaults: CvData = {
	header,
	commercialImpact,
	summary,
	experience,
	skills,
	education
};

export default cvDefaults;
