<script lang="ts">
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
	<label class="cv-editor-field">
		Highlight
		<textarea bind:value={highlight} placeholder="Wrap bold text in ##double hashes##"></textarea>
	</label>
	<button class="cv-editor-button cv-editor-button-danger" type="button" onclick={onRemove}
		>Remove highlight</button
	>
</div>
