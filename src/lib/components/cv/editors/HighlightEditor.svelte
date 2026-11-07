<script lang="ts">
	import RichTextEditor from '#lib/components/cv/editors/RichTextEditor.svelte';
	import type { CommercialImpact } from '#lib/types/cv.js';

	let {
		highlight = $bindable(),
		onRemove
	}: {
		highlight: CommercialImpact['highlights'][number];
		onRemove: () => void;
	} = $props();
</script>

<div class="cv-editor-entry">
	<h3>Highlight</h3>
	<RichTextEditor bind:segments={highlight} />
	<button class="cv-editor-button cv-editor-button-danger" type="button" onclick={onRemove}
		>Remove highlight</button
	>
</div>
