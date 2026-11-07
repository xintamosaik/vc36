<script lang="ts">
	import HeaderLinkEditor from '#lib/components/cv/editors/HeaderLinkEditor.svelte';
	import type { CvHeader } from '#lib/types/cv.js';

	let { data = $bindable(), onSave }: { data: CvHeader; onSave: () => void } = $props();
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
	{#each data.links as link, index (index)}
		<HeaderLinkEditor
			bind:link={data.links[index]}
			onRemove={() => data.links.splice(data.links.indexOf(link), 1)}
		/>
	{/each}
	<div class="cv-editor-actions">
		<button
			class="cv-editor-button"
			type="button"
			onclick={() => data.links.push({ label: '', href: '' })}>Add link</button
		>
		<button class="cv-editor-button cv-editor-button-primary" type="button" onclick={onSave}
			>Save header</button
		>
	</div>
</section>
