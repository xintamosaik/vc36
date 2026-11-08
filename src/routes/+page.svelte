<script lang="ts">
	import '#lib/components/cv/editors/editor.css';
	import HeaderEditor from '#lib/components/cv/editors/HeaderEditor.svelte';
	import CommercialImpactEditor from '#lib/components/cv/editors/CommercialImpactEditor.svelte';
	import SummaryEditor from '#lib/components/cv/editors/SummaryEditor.svelte';
	import ExperienceEditor from '#lib/components/cv/editors/ExperienceEditor.svelte';
	import SkillsEditor from '#lib/components/cv/editors/SkillsEditor.svelte';
	import EducationEditor from '#lib/components/cv/editors/EducationEditor.svelte';
	import WorkspaceNavigation from '#lib/components/cv/WorkspaceNavigation.svelte';
	import defaults from '#lib/data/cv/defaults.js';
	import { onMount } from 'svelte';
	import type { CvData, CvSection } from '#lib/types/cv.js';

	let cv = $state<CvData>(structuredClone(defaults));
	let selectedSection = $state<CvSection>('header');
	let isLoading = $state(true);
	let loadError = $state('');
	let saveMessage = $state('');
	let saveError = $state('');

	onMount(async () => {
		try {
			const response = await fetch('/api/cv');
			if (!response.ok) throw new Error(`Loading CV data failed (${response.status})`);
			cv = await response.json();
		} catch (cause) {
			loadError = cause instanceof Error ? cause.message : 'Could not load CV data';
		} finally {
			isLoading = false;
		}
	});

	async function saveSection(section: CvSection) {
		saveMessage = '';
		saveError = '';

		try {
			const response = await fetch(`/api/cv/${section}`, {
				method: 'PUT',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify(cv[section])
			});
			if (!response.ok) {
				const result: { message?: string } = await response.json();
				throw new Error(result.message ?? `Saving ${section} failed (${response.status})`);
			}
			saveMessage = `${section} saved`;
		} catch (cause) {
			saveError = cause instanceof Error ? cause.message : 'Could not save CV data';
		}
	}

	const sections: { id: CvSection; label: string; emoji: string; description: string }[] = [
		{
			id: 'header',
			label: 'Header & contact',
			emoji: '👤',
			description: 'Edit your name, role, intro, relocation note, and contact links.'
		},
		{
			id: 'commercialImpact',
			label: 'Commercial impact',
			emoji: '📈',
			description: 'Highlight measurable outcomes and business impact.'
		},
		{
			id: 'summary',
			label: 'Summary',
			emoji: '📝',
			description: 'Edit the short professional overview at the top of your CV.'
		},
		{
			id: 'experience',
			label: 'Experience',
			emoji: '💼',
			description: 'Manage roles, dates, locations, and achievement bullets.'
		},
		{
			id: 'skills',
			label: 'Skills',
			emoji: '🧰',
			description: 'Group and update your technical and professional skills.'
		},
		{
			id: 'education',
			label: 'Education',
			emoji: '🎓',
			description: 'Add or edit qualifications, institutions, and specializations.'
		}
	];
</script>

<svelte:head>
	<title>CV - Ulf Dellbrügge</title>
</svelte:head>

<main class="cv-workspace mx-auto min-h-screen w-full max-w-[88ch] px-4 py-6">
	<WorkspaceNavigation active="editor" />
	<section class="cv-tools space-y-6" aria-label="CV editor">
		{#if isLoading}
			<p role="status">Loading saved CV data…</p>
		{:else if loadError}
			<p class="text-sm text-red-300" role="alert">{loadError}. Refresh the page to try again.</p>
		{:else}
			<nav class="cv-editor-nav" aria-label="CV sections">
				{#each sections as section (section.id)}
					<button
						class="cv-editor-nav-button"
						class:active={selectedSection === section.id}
						type="button"
						aria-pressed={selectedSection === section.id}
						aria-label={section.label}
						aria-describedby={`${section.id}-description`}
						title={section.description}
						onclick={() => {
							selectedSection = section.id;
							saveMessage = '';
							saveError = '';
						}}
					>
						<span class="cv-editor-nav-emoji" aria-hidden="true">{section.emoji}</span>
						<span class="cv-editor-nav-tooltip" id={`${section.id}-description`} role="tooltip">
							{section.description}
						</span>
					</button>
				{/each}
			</nav>
			{#if saveMessage}
				<p class="text-sm text-green-300" role="status">{saveMessage}</p>
			{/if}
			{#if saveError}
				<p class="text-sm text-red-300" role="alert">{saveError}</p>
			{/if}
			{#if selectedSection === 'header'}
				<HeaderEditor bind:data={cv.header} onSave={() => saveSection('header')} />
			{:else if selectedSection === 'commercialImpact'}
				<CommercialImpactEditor
					bind:data={cv.commercialImpact}
					onSave={() => saveSection('commercialImpact')}
				/>
			{:else if selectedSection === 'summary'}
				<SummaryEditor bind:data={cv.summary} onSave={() => saveSection('summary')} />
			{:else if selectedSection === 'experience'}
				<ExperienceEditor bind:data={cv.experience} onSave={() => saveSection('experience')} />
			{:else if selectedSection === 'skills'}
				<SkillsEditor bind:data={cv.skills} onSave={() => saveSection('skills')} />
			{:else}
				<EducationEditor bind:data={cv.education} onSave={() => saveSection('education')} />
			{/if}
		{/if}
	</section>
</main>
