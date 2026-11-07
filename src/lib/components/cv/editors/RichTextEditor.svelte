<script lang="ts">
	import type { TextSegment } from '#lib/types/cv.js';

	let { segments = $bindable() }: { segments: TextSegment[] } = $props();
</script>

{#each segments as segment, index (index)}
	<div class="cv-editor-entry">
		{#if typeof segment === 'string'}
			<label class="cv-editor-field">
				Text
				<textarea value={segment} oninput={(event) => (segments[index] = event.currentTarget.value)}
				></textarea>
			</label>
		{:else}
			<label class="cv-editor-field">
				Text
				<textarea
					value={segment.text}
					oninput={(event) => (segment.text = event.currentTarget.value)}></textarea>
			</label>
			<label class="cv-editor-checkbox">
				<input type="checkbox" bind:checked={segment.strong} />
				Bold
			</label>
		{/if}
		<div class="cv-editor-actions">
			<button
				class="cv-editor-button cv-editor-button-danger"
				type="button"
				onclick={() => segments.splice(index, 1)}>Remove text part</button
			>
		</div>
	</div>
{/each}
<div class="cv-editor-actions">
	<button class="cv-editor-button" type="button" onclick={() => segments.push('')}>Add text</button>
	<button
		class="cv-editor-button"
		type="button"
		onclick={() => segments.push({ text: '', strong: true })}>Add bold text</button
	>
</div>
