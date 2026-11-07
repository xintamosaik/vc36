<script lang="ts">
	import ExperienceBulletEditor from '#lib/components/cv/editors/ExperienceBulletEditor.svelte';
	import type { Job } from '#lib/types/cv.js';

	let { job = $bindable(), onRemove }: { job: Job; onRemove: () => void } = $props();
</script>

<article class="cv-editor-entry">
	<h3>{job.role || 'Job entry'}</h3>
	<label class="cv-editor-field">Role <input bind:value={job.role} /></label>
	<label class="cv-editor-field">Company <input bind:value={job.company} /></label>
	<label class="cv-editor-field">Dates <input bind:value={job.dates} /></label>
	<label class="cv-editor-field">Location <input bind:value={job.location} /></label>
	<h4>Experience bullets</h4>
	{#each job.bullets as bullet, index (index)}
		<ExperienceBulletEditor
			bind:bullet={job.bullets[index]}
			onRemove={() => job.bullets.splice(job.bullets.indexOf(bullet), 1)}
		/>
	{/each}
	<div class="cv-editor-actions">
		<button
			class="cv-editor-button"
			type="button"
			onclick={() => job.bullets.push({ content: [''] })}>Add bullet</button
		>
		<button class="cv-editor-button cv-editor-button-danger" type="button" onclick={onRemove}
			>Remove job</button
		>
	</div>
</article>
