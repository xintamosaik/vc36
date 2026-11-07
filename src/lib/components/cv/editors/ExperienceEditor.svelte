<script lang="ts">
	import JobEditor from '#lib/components/cv/editors/JobEditor.svelte';
	import ItemSelector from '#lib/components/cv/editors/ItemSelector.svelte';
	import { selectedIndexAfterRemoval } from '#lib/components/cv/editors/item-selection.js';
	import type { Experience } from '#lib/types/cv.js';

	let { data = $bindable(), onSave }: { data: Experience; onSave: () => void } = $props();
	let selectedJobIndex = $state(data.jobs.length > 0 ? 0 : -1);

	function addJob() {
		data.jobs.push({
			role: '',
			company: '',
			dates: '',
			location: '',
			bullets: []
		});
		selectedJobIndex = data.jobs.length - 1;
	}

	function removeJob(index: number) {
		data.jobs.splice(index, 1);
		selectedJobIndex = selectedIndexAfterRemoval(selectedJobIndex, index, data.jobs.length);
	}
</script>

<section class="cv-editor-section">
	<h2>Experience</h2>
	<label class="cv-editor-field">Section title <input bind:value={data.title} /></label>
	<ItemSelector
		items={data.jobs.map((job) => `${job.role} — ${job.company}`)}
		bind:selectedIndex={selectedJobIndex}
		itemLabel="job"
		ariaLabel="Experience jobs"
		onAdd={addJob}
	/>
	{#if selectedJobIndex >= 0}
		<JobEditor
			bind:job={data.jobs[selectedJobIndex]}
			onRemove={() => removeJob(selectedJobIndex)}
		/>
	{/if}
	<div class="cv-editor-actions">
		<button class="cv-editor-button cv-editor-button-primary" type="button" onclick={onSave}
			>Save experience</button
		>
	</div>
</section>
