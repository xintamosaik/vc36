<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import WorkspaceNavigation from '#lib/components/cv/WorkspaceNavigation.svelte';
	import '#lib/components/cv/editors/editor.css';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	let name = $state('');
	let errorMessage = $state('');
	let isCreating = $state(false);

	async function createVariant(event: SubmitEvent) {
		event.preventDefault();
		errorMessage = '';
		isCreating = true;
		try {
			const response = await fetch('/api/cv/variants', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ name })
			});
			const result: { id?: string; message?: string } = await response.json();
			if (!response.ok || !result.id) {
				throw new Error(result.message ?? `Creating CV failed (${response.status})`);
			}
			await goto(resolve('/documents/[id]', { id: result.id }));
		} catch (cause) {
			errorMessage = cause instanceof Error ? cause.message : 'Could not create CV';
		} finally {
			isCreating = false;
		}
	}

	async function deleteVariant(id: string) {
		if (!window.confirm('Delete this CV variant? This cannot be undone.')) return;
		errorMessage = '';
		try {
			const response = await fetch(`/api/cv/variants/${encodeURIComponent(id)}`, {
				method: 'DELETE'
			});
			if (!response.ok) throw new Error(`Deleting CV failed (${response.status})`);
			await goto(resolve('/documents'), { invalidateAll: true });
		} catch (cause) {
			errorMessage = cause instanceof Error ? cause.message : 'Could not delete CV';
		}
	}
</script>

<svelte:head>
	<title>CV documents - Ulf Dellbrügge</title>
</svelte:head>

<main class="cv-workspace mx-auto min-h-screen w-full max-w-[88ch] px-4 py-6">
	<WorkspaceNavigation active="documents" />
	<section class="cv-tools space-y-6" aria-label="CV documents">
		<section class="cv-editor-section">
			<h2>CV documents</h2>
			<p>
				The main CV is the source of truth. Variants inherit its content and save only differences.
			</p>
			<a href={resolve('/')} class="cv-editor-button inline-block no-underline">Edit main CV</a>
		</section>

		<section class="cv-editor-section" aria-labelledby="variants-heading">
			<h2 id="variants-heading">Variants</h2>
			{#if data.variants.length === 0}
				<p>No variants yet.</p>
			{:else}
				<ul class="grid gap-3">
					{#each data.variants as variant (variant.id)}
						<li
							class="flex flex-wrap items-center justify-between gap-3 rounded border border-[#575751] p-3"
						>
							<a
								href={resolve('/documents/[id]', { id: variant.id })}
								class="underline underline-offset-4"
							>
								{variant.name}
							</a>
							<button
								class="cv-editor-button cv-editor-button-danger"
								type="button"
								onclick={() => deleteVariant(variant.id)}>Delete</button
							>
						</li>
					{/each}
				</ul>
			{/if}
		</section>

		<section class="cv-editor-section">
			<h2>Create a variant</h2>
			<form class="grid gap-3" onsubmit={createVariant}>
				<label class="cv-editor-field">
					Variant name
					<input bind:value={name} required maxlength="100" />
				</label>
				<div class="cv-editor-actions">
					<button
						class="cv-editor-button cv-editor-button-primary"
						type="submit"
						disabled={isCreating}
					>
						{isCreating ? 'Creating…' : 'Create variant'}
					</button>
				</div>
			</form>
		</section>
		{#if errorMessage}<p role="alert" class="text-red-300">{errorMessage}</p>{/if}
	</section>
</main>
