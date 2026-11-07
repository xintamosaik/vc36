<script lang="ts">
	import { resolve } from '$app/paths';
	import WorkspaceNavigation from '#lib/components/cv/WorkspaceNavigation.svelte';
	import '#lib/components/cv/editors/editor.css';
	import type { CvSection, CvVariant, CvVariantSkillChange } from '#lib/types/cv.js';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	// This is an editable local draft; route data remains unchanged until saved.
	// eslint-disable-next-line svelte/prefer-writable-derived
	let variant = $state<CvVariant>({
		id: '',
		name: '',
		hiddenSections: [],
		sectionTitles: {},
		hiddenJobIds: [],
		skillChanges: {},
		addedSkills: []
	});
	let saveMessage = $state('');
	let saveError = $state('');
	let isSaving = $state(false);

	$effect(() => {
		variant = structuredClone(data.variant);
	});

	const sections: { id: CvSection; title: string }[] = [
		{ id: 'header', title: 'Header & contact' },
		{ id: 'commercialImpact', title: 'Commercial impact' },
		{ id: 'summary', title: 'Summary' },
		{ id: 'experience', title: 'Experience' },
		{ id: 'skills', title: 'Skills' },
		{ id: 'education', title: 'Education' }
	];

	function sectionHidden(id: CvSection): boolean {
		return variant.hiddenSections.includes(id);
	}

	function setSectionHidden(id: CvSection, hidden: boolean) {
		variant.hiddenSections = hidden
			? [...variant.hiddenSections, id]
			: variant.hiddenSections.filter((section) => section !== id);
	}

	function updateSectionTitle(id: CvSection, title: string) {
		if (id === 'header') return;
		const titles = { ...variant.sectionTitles };
		if (title.trim()) titles[id] = title;
		else delete titles[id];
		variant.sectionTitles = titles;
	}

	function jobHidden(id: string): boolean {
		return variant.hiddenJobIds.includes(id);
	}

	function setJobHidden(id: string, hidden: boolean) {
		variant.hiddenJobIds = hidden
			? [...variant.hiddenJobIds, id]
			: variant.hiddenJobIds.filter((jobId) => jobId !== id);
	}

	function removeStaleJobOverride(id: string) {
		variant.hiddenJobIds = variant.hiddenJobIds.filter((jobId) => jobId !== id);
	}

	function skillMode(id: string): 'inherit' | 'hidden' | 'replacement' {
		return variant.skillChanges[id]?.kind ?? 'inherit';
	}

	function removeStaleSkillOverride(id: string) {
		const changes = { ...variant.skillChanges };
		delete changes[id];
		variant.skillChanges = changes;
	}

	function setSkillMode(id: string, mode: string) {
		if (mode === 'inherit') {
			const changes = { ...variant.skillChanges };
			delete changes[id];
			variant.skillChanges = changes;
		} else if (mode === 'hidden') {
			variant.skillChanges = { ...variant.skillChanges, [id]: { kind: 'hidden' } };
		} else {
			const original = data.cv.skills.skills.find((skill) => skill.id === id);
			if (!original) return;
			variant.skillChanges = {
				...variant.skillChanges,
				[id]: {
					kind: 'replacement',
					label: original.label,
					value: original.value
				}
			};
		}
	}

	function skillReplacement(id: string): Extract<CvVariantSkillChange, { kind: 'replacement' }> {
		const change = variant.skillChanges[id];
		if (change?.kind === 'replacement') return change;
		const original = data.cv.skills.skills.find((skill) => skill.id === id);
		return { kind: 'replacement', label: original?.label ?? '', value: original?.value ?? '' };
	}

	function updateSkillReplacement(id: string, key: 'label' | 'value', value: string) {
		const replacement = skillReplacement(id);
		variant.skillChanges = {
			...variant.skillChanges,
			[id]: { ...replacement, [key]: value }
		};
	}

	function addSkill() {
		variant.addedSkills.push({ id: crypto.randomUUID(), label: '', value: '' });
		variant.addedSkills = [...variant.addedSkills];
	}

	function removeSkill(id: string) {
		variant.addedSkills = variant.addedSkills.filter((skill) => skill.id !== id);
	}

	async function saveVariant() {
		saveMessage = '';
		saveError = '';
		if (!variant.name.trim()) {
			saveError = 'Enter a name for this CV variant.';
			return;
		}
		if (variant.addedSkills.some((skill) => !skill.label.trim() || !skill.value.trim())) {
			saveError = 'Each added skill row needs both a label and skill content.';
			return;
		}
		if (
			Object.values(variant.skillChanges).some(
				(change) => change.kind === 'replacement' && (!change.label.trim() || !change.value.trim())
			)
		) {
			saveError = 'Each replacement skill row needs both a label and skill content.';
			return;
		}
		isSaving = true;
		try {
			const response = await fetch(`/api/cv/variants/${encodeURIComponent(variant.id)}`, {
				method: 'PUT',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify(variant)
			});
			const result: { message?: string } = await response.json();
			if (!response.ok) throw new Error(result.message ?? `Saving CV failed (${response.status})`);
			saveMessage = 'CV variant saved';
		} catch (cause) {
			saveError = cause instanceof Error ? cause.message : 'Could not save CV variant';
		} finally {
			isSaving = false;
		}
	}
</script>

<svelte:head>
	<title>{variant.name} - CV - Ulf Dellbrügge</title>
</svelte:head>

<main class="cv-workspace mx-auto min-h-screen w-full max-w-[75ch] px-4 py-6">
	<WorkspaceNavigation active="editor" variantId={variant.id} />
	<section class="cv-tools space-y-6" aria-label="CV variant editor">
		<section class="cv-editor-section">
			<h2>Edit CV variant</h2>
			<p>Unchanged content inherits from the main CV. Overrides stay with this variant.</p>
			<label class="cv-editor-field">
				Name <input bind:value={variant.name} required maxlength="100" />
			</label>
		</section>

		<section class="cv-editor-section">
			<h2>Sections</h2>
			{#each sections as section (section.id)}
				<div class="cv-editor-entry">
					<label class="cv-editor-checkbox">
						<input
							type="checkbox"
							checked={!sectionHidden(section.id)}
							onchange={(event) => setSectionHidden(section.id, !event.currentTarget.checked)}
						/>
						Show {section.title}
					</label>
					{#if section.id !== 'header'}
						<label class="cv-editor-field">
							Section title override
							<input
								value={variant.sectionTitles[section.id] ?? ''}
								placeholder={data.cv[section.id].title}
								disabled={sectionHidden(section.id)}
								oninput={(event) => updateSectionTitle(section.id, event.currentTarget.value)}
							/>
						</label>
					{/if}
				</div>
			{/each}
		</section>

		<section class="cv-editor-section">
			<h2>Experience</h2>
			{#each variant.hiddenJobIds.filter((id) => !data.cv.experience.jobs.some((job) => job.id === id)) as staleId (staleId)}
				<p class="text-amber-200">
					A hidden job no longer exists in the main CV.
					<button class="underline" type="button" onclick={() => removeStaleJobOverride(staleId)}>
						Remove stale override
					</button>
				</p>
			{/each}
			{#each data.cv.experience.jobs as job (job.id)}
				<label class="cv-editor-checkbox">
					<input
						type="checkbox"
						checked={!jobHidden(job.id)}
						onchange={(event) => setJobHidden(job.id, !event.currentTarget.checked)}
					/>
					Show {job.role || 'Untitled role'} — {job.company || 'Untitled company'}
				</label>
			{/each}
		</section>

		<section class="cv-editor-section">
			<h2>Skills</h2>
			{#each Object.keys(variant.skillChanges).filter((id) => !data.cv.skills.skills.some((skill) => skill.id === id)) as staleId (staleId)}
				<p class="text-amber-200">
					A skill-row override no longer matches the main CV.
					<button class="underline" type="button" onclick={() => removeStaleSkillOverride(staleId)}>
						Remove stale override
					</button>
				</p>
			{/each}
			{#each data.cv.skills.skills as skill (skill.id)}
				<div class="cv-editor-entry">
					<label class="cv-editor-field">
						{skill.label}
						<select
							value={skillMode(skill.id)}
							onchange={(event) => setSkillMode(skill.id, event.currentTarget.value)}
						>
							<option value="inherit">Use main CV row</option>
							<option value="hidden">Hide row</option>
							<option value="replacement">Replace with variant row</option>
						</select>
					</label>
					{#if skillMode(skill.id) === 'replacement'}
						{@const replacement = skillReplacement(skill.id)}
						<label class="cv-editor-field">
							Replacement label
							<input
								value={replacement.label}
								required
								oninput={(event) =>
									updateSkillReplacement(skill.id, 'label', event.currentTarget.value)}
							/>
						</label>
						<label class="cv-editor-field">
							Replacement skills
							<textarea
								class="cv-editor-field-long"
								value={replacement.value}
								required
								oninput={(event) =>
									updateSkillReplacement(skill.id, 'value', event.currentTarget.value)}></textarea>
						</label>
					{/if}
				</div>
			{/each}
			<h3>Additional skill rows</h3>
			{#each variant.addedSkills as skill (skill.id)}
				<div class="cv-editor-entry">
					<label class="cv-editor-field">
						Label <input bind:value={skill.label} required />
					</label>
					<label class="cv-editor-field">
						Skills
						<textarea class="cv-editor-field-long" bind:value={skill.value} required></textarea>
					</label>
					<button
						class="cv-editor-button cv-editor-button-danger"
						type="button"
						onclick={() => removeSkill(skill.id)}>Remove row</button
					>
				</div>
			{/each}
			<button class="cv-editor-button" type="button" onclick={addSkill}>Add skill row</button>
		</section>

		<section class="cv-editor-section">
			<div class="cv-editor-actions">
				<button
					class="cv-editor-button cv-editor-button-primary"
					type="button"
					onclick={saveVariant}
					disabled={isSaving}
				>
					{isSaving ? 'Saving…' : 'Save variant'}
				</button>
				<a
					class="cv-editor-button inline-block no-underline"
					href={resolve(`/print-preview?variant=${encodeURIComponent(variant.id)}`)}
				>
					Preview this CV
				</a>
			</div>
			{#if saveMessage}<p role="status" class="text-green-300">{saveMessage}</p>{/if}
			{#if saveError}<p role="alert" class="text-red-300">{saveError}</p>{/if}
		</section>
	</section>
</main>
