<script lang="ts">
	import './print.css';
	import CommercialImpact from '#lib/components/cv/CommercialImpact.svelte';
	import CvHeader from '#lib/components/cv/CvHeader.svelte';
	import Education from '#lib/components/cv/Education.svelte';
	import Experience from '#lib/components/cv/Experience.svelte';
	import Skills from '#lib/components/cv/Skills.svelte';
	import Summary from '#lib/components/cv/Summary.svelte';
</script>

<main class="cv-document">
	<CvHeader />
	<CommercialImpact />
	<Summary />
	<Experience />
	<Skills />
	<Education />
</main>
