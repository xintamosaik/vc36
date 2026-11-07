<script lang="ts">
	import RichText from '#lib/components/cv/RichText.svelte';
	import { parseFatText } from '#lib/components/cv/fat-text.js';
	import type { CommercialImpact } from '#lib/types/cv.js';

	let { data }: { data: CommercialImpact } = $props();
</script>

<section id="commercial_impact">
	<h2>{data.title}</h2>
	<ul>
		{#each data.highlights as highlight, index (index)}
			<li><RichText segments={parseFatText(highlight)} /></li>
		{/each}
	</ul>
</section>
