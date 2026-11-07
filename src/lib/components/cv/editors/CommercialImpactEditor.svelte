<script lang="ts">
	import HighlightEditor from '#lib/components/cv/editors/HighlightEditor.svelte';
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
		selectedHighlightIndex =
			data.highlights.length === 0
				? -1
				: selectedHighlightIndex === index
					? Math.min(index, data.highlights.length - 1)
					: selectedHighlightIndex > index
						? selectedHighlightIndex - 1
						: selectedHighlightIndex;
	}

	function highlightNumber(index: number) {
		return ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣'][index] ?? `${index + 1}`;
	}
</script>

<section class="cv-editor-section">
	<h2>Commercial impact</h2>
	<label class="cv-editor-field">Section title <input bind:value={data.title} /></label>
	<div class="cv-editor-item-nav" role="group" aria-label="Commercial impact highlights">
		{#each data.highlights as highlight, index (index)}
			<button
				class="cv-editor-item-button"
				class:active={selectedHighlightIndex === index}
				type="button"
				aria-label={`Edit highlight ${index + 1}`}
				aria-pressed={selectedHighlightIndex === index}
				title={`Highlight ${index + 1}: ${highlight.replaceAll('##', '')}`}
				onclick={() => (selectedHighlightIndex = index)}
			>
				<span aria-hidden="true">{highlightNumber(index)}</span>
			</button>
		{/each}
		<button
			class="cv-editor-item-button"
			type="button"
			aria-label="Add highlight"
			title="Add highlight"
			onclick={addHighlight}
		>
			<span aria-hidden="true">➕</span>
		</button>
	</div>
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
