<script lang="ts">
	let {
		paragraph = $bindable(),
		onRemove
	}: {
		paragraph: string;
		onRemove: () => void;
	} = $props();
</script>

<div class="cv-editor-entry">
	<label class="cv-editor-field">
		Paragraph
		<textarea
			class="cv-editor-field-long"
			bind:value={paragraph}
			placeholder="Wrap bold text in ##double hashes##"></textarea>
	</label>
	<button class="cv-editor-button cv-editor-button-danger" type="button" onclick={onRemove}
		>Remove paragraph</button
	>
</div>
