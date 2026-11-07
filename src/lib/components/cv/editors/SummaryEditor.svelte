<script lang="ts">
	import SummaryParagraphEditor from '#lib/components/cv/editors/SummaryParagraphEditor.svelte';
	import ItemSelector from '#lib/components/cv/editors/ItemSelector.svelte';
	import { selectedIndexAfterRemoval } from '#lib/components/cv/editors/item-selection.js';
	import type { Summary } from '#lib/types/cv.js';

	let { data = $bindable(), onSave }: { data: Summary; onSave: () => void } = $props();
	let selectedParagraphIndex = $state(data.paragraphs.length > 0 ? 0 : -1);

	function addParagraph() {
		data.paragraphs.push('');
		selectedParagraphIndex = data.paragraphs.length - 1;
	}

	function removeParagraph(index: number) {
		data.paragraphs.splice(index, 1);
		selectedParagraphIndex = selectedIndexAfterRemoval(
			selectedParagraphIndex,
			index,
			data.paragraphs.length
		);
	}
</script>

<section class="cv-editor-section">
	<h2>Summary</h2>
	<label class="cv-editor-field">Section title <input bind:value={data.title} /></label>
	<ItemSelector
		items={data.paragraphs}
		bind:selectedIndex={selectedParagraphIndex}
		itemLabel="paragraph"
		ariaLabel="Summary paragraphs"
		onAdd={addParagraph}
	/>
	{#if selectedParagraphIndex >= 0}
		<SummaryParagraphEditor
			bind:paragraph={data.paragraphs[selectedParagraphIndex]}
			onRemove={() => removeParagraph(selectedParagraphIndex)}
		/>
	{/if}
	<div class="cv-editor-actions">
		<button class="cv-editor-button cv-editor-button-primary" type="button" onclick={onSave}
			>Save summary</button
		>
	</div>
</section>
