<script lang="ts">
	import HeaderLinkEditor from '#lib/components/cv/editors/HeaderLinkEditor.svelte';
	import type { CvHeader } from '#lib/types/cv.js';

	let { data = $bindable(), onSave }: { data: CvHeader; onSave: () => void } = $props();
	let selectedLinkIndex = $state(data.links.length > 0 ? 0 : -1);

	function addLink() {
		data.links.push({ label: '', href: '' });
		selectedLinkIndex = data.links.length - 1;
	}

	function removeLink(index: number) {
		data.links.splice(index, 1);
		selectedLinkIndex =
			data.links.length === 0
				? -1
				: selectedLinkIndex === index
					? Math.min(index, data.links.length - 1)
					: selectedLinkIndex > index
						? selectedLinkIndex - 1
						: selectedLinkIndex;
	}

	function linkNumber(index: number) {
		return ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣'][index] ?? `${index + 1}`;
	}
</script>

<section class="cv-editor-section">
	<h2>Header and contact</h2>
	<label class="cv-editor-field">Name <input bind:value={data.name} /></label>
	<label class="cv-editor-field">Role <input bind:value={data.role} /></label>
	<label class="cv-editor-field">
		Subtitle
		<textarea bind:value={data.subtitle}></textarea>
	</label>
	<h3>Relocation notes</h3>
	{#each data.relocation as item, index (index)}
		<div class="cv-editor-row">
			<label class="cv-editor-field">
				Note
				<input
					value={item}
					oninput={(event) => (data.relocation[index] = event.currentTarget.value)}
				/>
			</label>
			<button
				class="cv-editor-button cv-editor-button-danger"
				type="button"
				onclick={() => data.relocation.splice(index, 1)}>Remove</button
			>
		</div>
	{/each}
	<button class="cv-editor-button" type="button" onclick={() => data.relocation.push('')}
		>Add note</button
	>
	<h3>Links</h3>
	<div class="cv-editor-link-nav" role="group" aria-label="Header links">
		{#each data.links as link, index (index)}
			<button
				class="cv-editor-link-button"
				class:active={selectedLinkIndex === index}
				type="button"
				aria-label={`Edit link ${index + 1}${link.label ? `: ${link.label}` : ''}`}
				aria-pressed={selectedLinkIndex === index}
				title={link.label || `Link ${index + 1}`}
				onclick={() => (selectedLinkIndex = index)}
			>
				<span aria-hidden="true">{linkNumber(index)}</span>
			</button>
		{/each}
		<button
			class="cv-editor-link-button"
			type="button"
			aria-label="Add link"
			title="Add link"
			onclick={addLink}
		>
			<span aria-hidden="true">➕</span>
		</button>
	</div>
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
