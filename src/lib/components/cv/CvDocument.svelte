<script lang="ts">
	import './print.css';
	import CommercialImpact from '#lib/components/cv/CommercialImpact.svelte';
	import CvHeader from '#lib/components/cv/CvHeader.svelte';
	import Education from '#lib/components/cv/Education.svelte';
	import Experience from '#lib/components/cv/Experience.svelte';
	import Skills from '#lib/components/cv/Skills.svelte';
	import Summary from '#lib/components/cv/Summary.svelte';
	import type { CvData } from '#lib/types/cv.js';

	let { data }: { data: CvData } = $props();
</script>

<main class="cv-document">
	<CvHeader data={data.header} />
	<CommercialImpact data={data.commercialImpact} />
	<Summary data={data.summary} />
	<Experience data={data.experience} />
	<Skills data={data.skills} />
	<Education data={data.education} />
</main>
