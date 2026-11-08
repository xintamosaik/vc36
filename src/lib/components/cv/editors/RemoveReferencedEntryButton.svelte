<script lang="ts">
	import { onDestroy } from 'svelte';
	import { deletionBlockers } from '#lib/cv-references.js';
	import type { CvVariant } from '#lib/types/cv.js';

	let {
		id,
		section,
		label,
		onRemove
	}: {
		id: string;
		section: 'experience' | 'skills';
		label: string;
		onRemove: () => void;
	} = $props();
	let blockers = $state<string[]>([]);
	let checking = $state(true);
	let checkError = $state('');
	let active = true;
	onDestroy(() => {
		active = false;
	});

	async function checkReferences(entryId: string, entrySection: 'experience' | 'skills') {
		checking = true;
		checkError = '';
		try {
			const response = await fetch('/api/cv/variants', { cache: 'no-store' });
			if (!response.ok)
				throw new Error('Could not check references. Try again before removing this entry.');
			const variants: CvVariant[] = await response.json();
			if (!active || entryId !== id || entrySection !== section) return false;
			blockers = deletionBlockers(variants, entrySection, entryId).map((variant) => variant.name);
			return blockers.length === 0;
		} catch (cause) {
			if (active && entryId === id && entrySection === section) {
				checkError = cause instanceof Error ? cause.message : 'Could not check references.';
			}
			return false;
		} finally {
			if (active && entryId === id && entrySection === section) checking = false;
		}
	}

	$effect(() => {
		void checkReferences(id, section);
	});

	async function remove() {
		if (await checkReferences(id, section)) onRemove();
	}
</script>

<button
	class="cv-editor-button cv-editor-button-danger"
	type="button"
	disabled={checking || blockers.length > 0 || !!checkError}
	onclick={remove}
>
	Remove {label}
</button>
{#if blockers.length > 0}
	<p role="status">
		Used by {blockers.join(', ')}. Remove those references before deleting this {label}.
	</p>
{/if}
{#if checkError}<p role="alert">{checkError}</p>{/if}
{#if blockers.length > 0 || checkError}
	<button
		class="cv-editor-button"
		type="button"
		disabled={checking}
		onclick={() => checkReferences(id, section)}>Check references again</button
	>
{/if}
