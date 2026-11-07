<script lang="ts">
	import SkillEditor from '#lib/components/cv/editors/SkillEditor.svelte';
	import ItemSelector from '#lib/components/cv/editors/ItemSelector.svelte';
	import { selectedIndexAfterRemoval } from '#lib/components/cv/editors/item-selection.js';
	import type { Skills } from '#lib/types/cv.js';

	let { data = $bindable(), onSave }: { data: Skills; onSave: () => void } = $props();
	let selectedSkillIndex = $state(data.skills.length > 0 ? 0 : -1);

	function addSkill() {
		data.skills.push({ label: '', value: '' });
		selectedSkillIndex = data.skills.length - 1;
	}

	function removeSkill(index: number) {
		data.skills.splice(index, 1);
		selectedSkillIndex = selectedIndexAfterRemoval(selectedSkillIndex, index, data.skills.length);
	}
</script>

<section class="cv-editor-section">
	<h2>Skills</h2>
	<label class="cv-editor-field">Section title <input bind:value={data.title} /></label>
	<ItemSelector
		items={data.skills.map((skill) => skill.label)}
		bind:selectedIndex={selectedSkillIndex}
		itemLabel="skill group"
		ariaLabel="Skill groups"
		onAdd={addSkill}
	/>
	{#if selectedSkillIndex >= 0}
		<SkillEditor
			bind:skill={data.skills[selectedSkillIndex]}
			onRemove={() => removeSkill(selectedSkillIndex)}
		/>
	{/if}
	<div class="cv-editor-actions">
		<button class="cv-editor-button cv-editor-button-primary" type="button" onclick={onSave}
			>Save skills</button
		>
	</div>
</section>
