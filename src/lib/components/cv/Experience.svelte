<script lang="ts">
	import RichText from '#lib/components/cv/RichText.svelte';
	import type { Experience } from '#lib/types/cv.js';

	let { data }: { data: Experience } = $props();
</script>

<section id="experience">
	<h2>{data.title}</h2>
	{#each data.jobs as job, jobIndex (jobIndex)}
		<div class="job entry">
			<h3>
				<span>{job.role}</span>
				<span class="dash"></span>
				<span>{job.company}</span>
			</h3>
			<h4>
				<span>{job.dates}</span>
				<span class="dash"></span>
				<span>{job.location}</span>
			</h4>

			<ul>
				{#each job.bullets as bullet, bulletIndex (bulletIndex)}
					<li>
						{#if 'paragraph' in bullet && bullet.paragraph}
							<p><RichText segments={bullet.content} /></p>
						{:else}
							<RichText segments={bullet.content} />
						{/if}
					</li>
				{/each}
			</ul>
		</div>
	{/each}
</section>
