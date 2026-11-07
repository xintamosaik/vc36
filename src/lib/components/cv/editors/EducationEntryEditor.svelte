<script lang="ts">
	import type { Education } from '#lib/types/cv.js';

	let {
		entry = $bindable(),
		onRemove
	}: {
		entry: Education['entries'][number];
		onRemove: () => void;
	} = $props();
</script>

<article class="cv-editor-entry">
	<h3>{entry.qualification || 'Education entry'}</h3>
	<label class="cv-editor-field">
		Qualification
		<input bind:value={entry.qualification} />
	</label>
	<label class="cv-editor-field">Institution <input bind:value={entry.institution} /></label>
	<label class="cv-editor-field">Date <input bind:value={entry.date} /></label>
	<label class="cv-editor-field">Location <input bind:value={entry.location} /></label>
	<label class="cv-editor-field">
		Specialization
		<textarea
			class="cv-editor-field-long"
			bind:value={entry.specialization}
			placeholder="Wrap bold text in ##double hashes##"></textarea>
	</label>
	<button class="cv-editor-button cv-editor-button-danger" type="button" onclick={onRemove}
		>Remove education</button
	>
</article>
