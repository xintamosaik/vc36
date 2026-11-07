<script lang="ts">
	import type { CvHeader } from '#lib/types/cv.js';

	let {
		link = $bindable(),
		onRemove
	}: {
		link: CvHeader['links'][number];
		onRemove: () => void;
	} = $props();
</script>

<div class="cv-editor-entry">
	<label class="cv-editor-field">
		Label
		<input bind:value={link.label} />
	</label>
	<label class="cv-editor-field">
		URL
		<input bind:value={link.href} type="url" />
	</label>
	<label class="cv-editor-checkbox">
		<input type="checkbox" bind:checked={link.targetBlank} />
		Open in new tab
	</label>
	<button class="cv-editor-button cv-editor-button-danger" type="button" onclick={onRemove}
		>Remove link</button
	>
</div>
