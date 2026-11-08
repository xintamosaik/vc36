<script lang="ts">
	import ExperienceBulletEditor from '#lib/components/cv/editors/ExperienceBulletEditor.svelte';
	import RemoveReferencedEntryButton from './RemoveReferencedEntryButton.svelte';
	import ItemSelector from '#lib/components/cv/editors/ItemSelector.svelte';
	import { selectedIndexAfterRemoval } from '#lib/components/cv/editors/item-selection.js';
	import type { Job } from '#lib/types/cv.js';

	let { job = $bindable(), onRemove }: { job: Job; onRemove: () => void } = $props();
	let selectedBulletIndex = $state(job.bullets.length > 0 ? 0 : -1);

	function addBullet() {
		job.bullets.push({ content: '' });
		selectedBulletIndex = job.bullets.length - 1;
	}

	function removeBullet(index: number) {
		job.bullets.splice(index, 1);
		selectedBulletIndex = selectedIndexAfterRemoval(selectedBulletIndex, index, job.bullets.length);
	}
</script>

<article class="cv-editor-entry">
	<h3>{job.role || 'Job entry'}</h3>
	<label class="cv-editor-field">Role <input bind:value={job.role} /></label>
	<label class="cv-editor-field">Company <input bind:value={job.company} /></label>
	<label class="cv-editor-field">Dates <input bind:value={job.dates} /></label>
	<label class="cv-editor-field">Location <input bind:value={job.location} /></label>
	<h4>Experience bullets</h4>
	<ItemSelector
		items={job.bullets.map((bullet) => bullet.content.replaceAll('##', ''))}
		bind:selectedIndex={selectedBulletIndex}
		itemLabel="bullet"
		ariaLabel="Job experience bullets"
		onAdd={addBullet}
	/>
	{#if selectedBulletIndex >= 0}
		<ExperienceBulletEditor
			bind:bullet={job.bullets[selectedBulletIndex]}
			onRemove={() => removeBullet(selectedBulletIndex)}
		/>
	{/if}
	<div class="cv-editor-actions">
		<RemoveReferencedEntryButton id={job.id} section="experience" label="job" {onRemove} />
	</div>
</article>
