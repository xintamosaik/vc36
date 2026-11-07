<script lang="ts">
	import data from '#lib/data/cv/header.json';
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
		{#each data.relocation as item, index}
			{#if index > 0}<span class="dash"></span>{/if}
			<span>{item}</span>
		{/each}
	</p>
</section>

<section class="contact">
	<p>
		{#each data.links as link, index}
			{#if index > 0}<span class="dash"></span>{/if}
			<span>
				<a
					href={link.href}
					target={link.targetBlank ? '_blank' : undefined}
					rel={link.targetBlank ? 'noreferrer' : undefined}>{link.label}</a
				>
			</span>
		{/each}
	</p>
</section>
