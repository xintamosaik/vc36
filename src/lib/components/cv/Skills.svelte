<script lang="ts">
	import FatText from '#lib/components/cv/FatText.svelte';
	import type { Skills } from '#lib/types/cv.js';

	let { data }: { data: Skills } = $props();
</script>

<section>
	<h2>{data.title}</h2>
	<ul>
		{#each data.skills as skill, index (index)}
			<li><strong>{skill.label}:</strong> <FatText text={skill.value} /></li>
		{/each}
	</ul>
</section>
