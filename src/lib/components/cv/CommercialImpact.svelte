<script lang="ts">
	import data from '#lib/data/cv/commercial-impact.json';
	import RichText from '#lib/components/cv/RichText.svelte';
</script>

<section id="commercial_impact">
	<h2>{data.title}</h2>
	<ul>
		{#each data.highlights as highlight}
			<li><RichText segments={highlight} /></li>
		{/each}
	</ul>
</section>
