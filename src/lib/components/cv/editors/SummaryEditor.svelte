<script lang="ts">
	import SummaryParagraphEditor from '#lib/components/cv/editors/SummaryParagraphEditor.svelte';
	import type { Summary } from '#lib/types/cv.js';

	let { data = $bindable(), onSave }: { data: Summary; onSave: () => void } = $props();
</script>

<section class="cv-editor-section">
	<h2>Summary</h2>
	<label class="cv-editor-field">Section title <input bind:value={data.title} /></label>
	{#each data.paragraphs as paragraph, index (index)}
		<SummaryParagraphEditor
			bind:paragraph={data.paragraphs[index]}
			onRemove={() => data.paragraphs.splice(data.paragraphs.indexOf(paragraph, index), 1)}
		/>
	{/each}
	<div class="cv-editor-actions">
		<button class="cv-editor-button" type="button" onclick={() => data.paragraphs.push('')}
			>Add paragraph</button
		>
		<button class="cv-editor-button cv-editor-button-primary" type="button" onclick={onSave}
			>Save summary</button
		>
	</div>
</section>
