<script lang="ts">
	import FatText from '#lib/components/cv/FatText.svelte';
	import type { Summary } from '#lib/types/cv.js';

	let { data }: { data: Summary } = $props();
</script>

<section id="summary">
	<h2>{data.title}</h2>
	{#each data.paragraphs as paragraph, index (index)}
		<p><FatText text={paragraph} /></p>
	{/each}
</section>
