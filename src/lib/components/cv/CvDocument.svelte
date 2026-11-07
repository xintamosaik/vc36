<script lang="ts">
	import './print.css';
	import CommercialImpact from '#lib/components/cv/CommercialImpact.svelte';
	import CvHeader from '#lib/components/cv/CvHeader.svelte';
	import Education from '#lib/components/cv/Education.svelte';
	import Experience from '#lib/components/cv/Experience.svelte';
	import Skills from '#lib/components/cv/Skills.svelte';
	import Summary from '#lib/components/cv/Summary.svelte';
	import type { CvData, CvSection } from '#lib/types/cv.js';

	let { data, hiddenSections = [] }: { data: CvData; hiddenSections?: CvSection[] } = $props();
</script>

<main class="cv-document">
	{#if !hiddenSections.includes('header')}<CvHeader data={data.header} />{/if}
	{#if !hiddenSections.includes('commercialImpact')}<CommercialImpact
			data={data.commercialImpact}
		/>{/if}
	{#if !hiddenSections.includes('summary')}<Summary data={data.summary} />{/if}
	{#if !hiddenSections.includes('experience')}<Experience data={data.experience} />{/if}
	{#if !hiddenSections.includes('skills')}<Skills data={data.skills} />{/if}
	{#if !hiddenSections.includes('education')}<Education data={data.education} />{/if}
</main>
