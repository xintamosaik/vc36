<script lang="ts">
	import JobEditor from '#lib/components/cv/editors/JobEditor.svelte';
	import type { Experience } from '#lib/types/cv.js';

	let { data = $bindable(), onSave }: { data: Experience; onSave: () => void } = $props();
</script>

<section class="cv-editor-section">
	<h2>Experience</h2>
	<label class="cv-editor-field">Section title <input bind:value={data.title} /></label>
	{#each data.jobs as job, index (index)}
		<JobEditor
			bind:job={data.jobs[index]}
			onRemove={() => data.jobs.splice(data.jobs.indexOf(job), 1)}
		/>
	{/each}
	<div class="cv-editor-actions">
		<button
			class="cv-editor-button"
			type="button"
			onclick={() =>
				data.jobs.push({
					role: '',
					company: '',
					dates: '',
					location: '',
					bullets: []
				})}>Add job</button
		>
		<button class="cv-editor-button cv-editor-button-primary" type="button" onclick={onSave}
			>Save experience</button
		>
	</div>
</section>
