<script lang="ts">
	import SummaryParagraphEditor from '#lib/components/cv/editors/SummaryParagraphEditor.svelte';
	import type { Summary } from '#lib/types/cv.js';

	let { data = $bindable(), onSave }: { data: Summary; onSave: () => void } = $props();
	let selectedParagraphIndex = $state(data.paragraphs.length > 0 ? 0 : -1);

	function addParagraph() {
		data.paragraphs.push('');
		selectedParagraphIndex = data.paragraphs.length - 1;
	}

	function removeParagraph(index: number) {
		data.paragraphs.splice(index, 1);
		selectedParagraphIndex =
			data.paragraphs.length === 0
				? -1
				: selectedParagraphIndex === index
					? Math.min(index, data.paragraphs.length - 1)
					: selectedParagraphIndex > index
						? selectedParagraphIndex - 1
						: selectedParagraphIndex;
	}

	function paragraphNumber(index: number) {
		return ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣'][index] ?? `${index + 1}`;
	}
</script>

<section class="cv-editor-section">
	<h2>Summary</h2>
	<label class="cv-editor-field">Section title <input bind:value={data.title} /></label>
	<div class="cv-editor-item-nav" role="group" aria-label="Summary paragraphs">
		{#each data.paragraphs as paragraph, index (index)}
			<button
				class="cv-editor-item-button"
				class:active={selectedParagraphIndex === index}
				type="button"
				aria-label={`Edit paragraph ${index + 1}`}
				aria-pressed={selectedParagraphIndex === index}
				title={`Paragraph ${index + 1}: ${paragraph}`}
				onclick={() => (selectedParagraphIndex = index)}
			>
				<span aria-hidden="true">{paragraphNumber(index)}</span>
			</button>
		{/each}
		<button
			class="cv-editor-item-button"
			type="button"
			aria-label="Add paragraph"
			title="Add paragraph"
			onclick={addParagraph}
		>
			<span aria-hidden="true">➕</span>
		</button>
	</div>
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
