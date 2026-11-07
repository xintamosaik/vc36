<script lang="ts">
	import FatText from '#lib/components/cv/FatText.svelte';
	import type { CommercialImpact } from '#lib/types/cv.js';

	let { data }: { data: CommercialImpact } = $props();
</script>

<section id="commercial_impact">
	<h2>{data.title}</h2>
	<ul>
		{#each data.highlights as highlight, index (index)}
			<li><FatText text={highlight} /></li>
		{/each}
	</ul>
</section>
