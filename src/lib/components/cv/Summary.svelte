<script lang="ts">
	import data from '#lib/data/cv/summary.json';
</script>

<section id="summary">
	<h2>{data.title}</h2>
	{#each data.paragraphs as paragraph}
		<p>{paragraph}</p>
	{/each}
</section>
