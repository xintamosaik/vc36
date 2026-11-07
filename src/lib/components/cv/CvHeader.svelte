<script lang="ts">
	import type { CvHeader } from '#lib/types/cv.js';

	let { data }: { data: CvHeader } = $props();
</script>

<section id="title">
	<h1>
		<span>{data.name}</span>
		<span class="dash"></span>
		<span>{data.role}</span>
	</h1>
</section>

<section id="subtitle">
	<p>
		<strong>{data.subtitle}</strong>
	</p>
</section>

<section class="contact">
	<p>
		{#each data.relocation as item, index (index)}
			{#if index > 0}<span class="dash"></span>{/if}
			<span>{item}</span>
		{/each}
	</p>
</section>

<section class="contact">
	<p>
		{#each data.links as link, index (index)}
			{#if index > 0}<span class="dash"></span>{/if}
			<span>
				<a
					href={link.href}
					target={link.targetBlank ? '_blank' : undefined}
					rel="external noreferrer">{link.label}</a
				>
			</span>
		{/each}
	</p>
</section>
