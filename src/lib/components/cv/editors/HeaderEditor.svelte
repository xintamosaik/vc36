<script lang="ts">
	import HeaderLinkEditor from '#lib/components/cv/editors/HeaderLinkEditor.svelte';
	import ItemSelector from '#lib/components/cv/editors/ItemSelector.svelte';
	import { selectedIndexAfterRemoval } from '#lib/components/cv/editors/item-selection.js';
	import type { CvHeader } from '#lib/types/cv.js';

	let { data = $bindable(), onSave }: { data: CvHeader; onSave: () => void } = $props();
	let selectedLinkIndex = $state(data.links.length > 0 ? 0 : -1);

	function addLink() {
		data.links.push({ label: '', href: '' });
		selectedLinkIndex = data.links.length - 1;
	}

	function removeLink(index: number) {
		data.links.splice(index, 1);
		selectedLinkIndex = selectedIndexAfterRemoval(selectedLinkIndex, index, data.links.length);
	}

	function addRelocation() {
		data.relocation.push('');
		selectedRelocationIndex = data.relocation.length - 1;
	}

	function removeRelocation(index: number) {
		data.relocation.splice(index, 1);
		selectedRelocationIndex = selectedIndexAfterRemoval(
			selectedRelocationIndex,
			index,
			data.relocation.length
		);
	}

	let selectedRelocationIndex = $state(data.relocation.length > 0 ? 0 : -1);
</script>

<section class="cv-editor-section">
	<h2>Header and contact</h2>
	<label class="cv-editor-field">Name <input bind:value={data.name} /></label>
	<label class="cv-editor-field">Role <input bind:value={data.role} /></label>
	<label class="cv-editor-field">
		Subtitle
		<textarea class="cv-editor-field-long" bind:value={data.subtitle}></textarea>
	</label>
	<h3>Relocation notes</h3>
	<ItemSelector
		items={data.relocation}
		bind:selectedIndex={selectedRelocationIndex}
		itemLabel="relocation note"
		ariaLabel="Relocation notes"
		onAdd={addRelocation}
	/>
	{#if selectedRelocationIndex >= 0}
		<div class="cv-editor-row">
			<label class="cv-editor-field">
				Note
				<input
					value={data.relocation[selectedRelocationIndex]}
					placeholder="Wrap bold text in ##double hashes##"
					oninput={(event) =>
						(data.relocation[selectedRelocationIndex] = event.currentTarget.value)}
				/>
			</label>
			<button
				class="cv-editor-button cv-editor-button-danger"
				type="button"
				onclick={() => removeRelocation(selectedRelocationIndex)}>Remove</button
			>
		</div>
	{/if}
	<h3>Links</h3>
	<ItemSelector
		items={data.links.map((link) => link.label)}
		bind:selectedIndex={selectedLinkIndex}
		itemLabel="link"
		ariaLabel="Header links"
		onAdd={addLink}
	/>
	{#if selectedLinkIndex >= 0}
		<HeaderLinkEditor
			bind:link={data.links[selectedLinkIndex]}
			onRemove={() => removeLink(selectedLinkIndex)}
		/>
	{/if}
	<div class="cv-editor-actions">
		<button class="cv-editor-button cv-editor-button-primary" type="button" onclick={onSave}
			>Save header</button
		>
	</div>
</section>
