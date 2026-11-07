<script lang="ts">
	import SkillEditor from '#lib/components/cv/editors/SkillEditor.svelte';
	import type { Skills } from '#lib/types/cv.js';

	let { data = $bindable(), onSave }: { data: Skills; onSave: () => void } = $props();
</script>

<section class="cv-editor-section">
	<h2>Skills</h2>
	<label class="cv-editor-field">Section title <input bind:value={data.title} /></label>
	{#each data.skills as skill, index (index)}
		<SkillEditor
			bind:skill={data.skills[index]}
			onRemove={() => data.skills.splice(data.skills.indexOf(skill), 1)}
		/>
	{/each}
	<div class="cv-editor-actions">
		<button
			class="cv-editor-button"
			type="button"
			onclick={() => data.skills.push({ label: '', value: '' })}>Add skill group</button
		>
		<button class="cv-editor-button cv-editor-button-primary" type="button" onclick={onSave}
			>Save skills</button
		>
	</div>
</section>
