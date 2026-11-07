<script lang="ts">
	import HighlightEditor from '#lib/components/cv/editors/HighlightEditor.svelte';
	import ItemSelector from '#lib/components/cv/editors/ItemSelector.svelte';
	import { selectedIndexAfterRemoval } from '#lib/components/cv/editors/item-selection.js';
	import type { CommercialImpact } from '#lib/types/cv.js';

	let {
		data = $bindable(),
		onSave
	}: {
		data: CommercialImpact;
		onSave: () => void;
	} = $props();
	let selectedHighlightIndex = $state(data.highlights.length > 0 ? 0 : -1);

	function addHighlight() {
		data.highlights.push('');
		selectedHighlightIndex = data.highlights.length - 1;
	}

	function removeHighlight(index: number) {
		data.highlights.splice(index, 1);
		selectedHighlightIndex = selectedIndexAfterRemoval(
			selectedHighlightIndex,
			index,
			data.highlights.length
		);
	}
</script>

<section class="cv-editor-section">
	<h2>Commercial impact</h2>
	<label class="cv-editor-field">Section title <input bind:value={data.title} /></label>
	<ItemSelector
		items={data.highlights}
		bind:selectedIndex={selectedHighlightIndex}
		itemLabel="highlight"
		ariaLabel="Commercial impact highlights"
		onAdd={addHighlight}
	/>
	{#if selectedHighlightIndex >= 0}
		<HighlightEditor
			bind:highlight={data.highlights[selectedHighlightIndex]}
			onRemove={() => removeHighlight(selectedHighlightIndex)}
		/>
	{/if}
	<div class="cv-editor-actions">
		<button class="cv-editor-button cv-editor-button-primary" type="button" onclick={onSave}
			>Save highlights</button
		>
	</div>
</section>
