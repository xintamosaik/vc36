<script lang="ts">
	import type { Skills } from '#lib/types/cv.js';
	import RemoveReferencedEntryButton from './RemoveReferencedEntryButton.svelte';

	let {
		skill = $bindable(),
		onRemove
	}: {
		skill: Skills['skills'][number];
		onRemove: () => void;
	} = $props();
</script>

<div class="cv-editor-entry">
	<label class="cv-editor-field">Label <input bind:value={skill.label} /></label>
	<label class="cv-editor-field">
		Skills
		<textarea
			class="cv-editor-field-long"
			bind:value={skill.value}
			placeholder="Wrap bold text in ##double hashes##"></textarea>
	</label>
	<RemoveReferencedEntryButton id={skill.id} section="skills" label="skill group" {onRemove} />
</div>
