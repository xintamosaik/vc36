<script lang="ts">
	import RichTextEditor from '#lib/components/cv/editors/RichTextEditor.svelte';
	import type { ExperienceBullet } from '#lib/types/cv.js';

	let {
		bullet = $bindable(),
		onRemove
	}: {
		bullet: ExperienceBullet;
		onRemove: () => void;
	} = $props();
</script>

<div class="cv-editor-entry">
	<h3>Bullet</h3>
	<label class="cv-editor-checkbox">
		<input
			type="checkbox"
			checked={bullet.paragraph ?? false}
			onchange={(event) => (bullet.paragraph = event.currentTarget.checked)}
		/>
		Use paragraph spacing
	</label>
	<RichTextEditor bind:segments={bullet.content} />
	<button class="cv-editor-button cv-editor-button-danger" type="button" onclick={onRemove}
		>Remove bullet</button
	>
</div>
