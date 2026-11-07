<script lang="ts">
	import EducationEntryEditor from '#lib/components/cv/editors/EducationEntryEditor.svelte';
	import ItemSelector from '#lib/components/cv/editors/ItemSelector.svelte';
	import { selectedIndexAfterRemoval } from '#lib/components/cv/editors/item-selection.js';
	import type { Education } from '#lib/types/cv.js';

	let { data = $bindable(), onSave }: { data: Education; onSave: () => void } = $props();
	let selectedEntryIndex = $state(data.entries.length > 0 ? 0 : -1);

	function addEntry() {
		data.entries.push({
			qualification: '',
			institution: '',
			date: '',
			location: '',
			specialization: ''
		});
		selectedEntryIndex = data.entries.length - 1;
	}

	function removeEntry(index: number) {
		data.entries.splice(index, 1);
		selectedEntryIndex = selectedIndexAfterRemoval(selectedEntryIndex, index, data.entries.length);
	}
</script>

<section class="cv-editor-section">
	<h2>Education</h2>
	<label class="cv-editor-field">Section title <input bind:value={data.title} /></label>
	<ItemSelector
		items={data.entries.map((entry) => entry.qualification || entry.institution)}
		bind:selectedIndex={selectedEntryIndex}
		itemLabel="education entry"
		ariaLabel="Education entries"
		onAdd={addEntry}
	/>
	{#if selectedEntryIndex >= 0}
		<EducationEntryEditor
			bind:entry={data.entries[selectedEntryIndex]}
			onRemove={() => removeEntry(selectedEntryIndex)}
		/>
	{/if}
	<div class="cv-editor-actions">
		<button class="cv-editor-button cv-editor-button-primary" type="button" onclick={onSave}
			>Save education</button
		>
	</div>
</section>
