<script lang="ts">
	import EducationEntryEditor from '#lib/components/cv/editors/EducationEntryEditor.svelte';
	import type { Education } from '#lib/types/cv.js';

	let { data = $bindable(), onSave }: { data: Education; onSave: () => void } = $props();
</script>

<section class="cv-editor-section">
	<h2>Education</h2>
	<label class="cv-editor-field">Section title <input bind:value={data.title} /></label>
	{#each data.entries as entry, index (index)}
		<EducationEntryEditor
			bind:entry={data.entries[index]}
			onRemove={() => data.entries.splice(data.entries.indexOf(entry), 1)}
		/>
	{/each}
	<div class="cv-editor-actions">
		<button
			class="cv-editor-button"
			type="button"
			onclick={() =>
				data.entries.push({
					qualification: '',
					institution: '',
					date: '',
					location: '',
					specialization: ''
				})}>Add education</button
		>
		<button class="cv-editor-button cv-editor-button-primary" type="button" onclick={onSave}
			>Save education</button
		>
	</div>
</section>
