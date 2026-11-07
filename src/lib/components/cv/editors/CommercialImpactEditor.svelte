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
</script>

<section class="cv-editor-section">
	<h2>Commercial impact</h2>
	<label class="cv-editor-field">Section title <input bind:value={data.title} /></label>
	{#each data.highlights as highlight, index (index)}
		<HighlightEditor
			bind:highlight={data.highlights[index]}
			onRemove={() => data.highlights.splice(data.highlights.indexOf(highlight), 1)}
		/>
	{/each}
	<div class="cv-editor-actions">
		<button class="cv-editor-button" type="button" onclick={() => data.highlights.push('')}
			>Add highlight</button
		>
		<button class="cv-editor-button cv-editor-button-primary" type="button" onclick={onSave}
			>Save highlights</button
		>
	</div>
</section>
