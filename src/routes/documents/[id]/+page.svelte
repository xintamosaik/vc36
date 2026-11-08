<script lang="ts">
	import { resolve } from '$app/paths';
	import WorkspaceNavigation from '#lib/components/cv/WorkspaceNavigation.svelte';
	import ItemSelector from '#lib/components/cv/editors/ItemSelector.svelte';
	import { selectedIndexAfterRemoval } from '#lib/components/cv/editors/item-selection.js';
	import '#lib/components/cv/editors/editor.css';
	import type { CvSection, CvVariant, ExperienceBullet } from '#lib/types/cv.js';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	let selectedSection = $state<CvSection>('header');
	let selectedSummaryIndex = $state(-1);
	let selectedBulletIndexes = $state<Record<string, number>>({});
	// This is an editable local draft; route data remains unchanged until saved.
	let variant = $state<CvVariant>({
		id: '',
		name: '',
		hiddenSections: [],
		sectionTitles: {},
		hiddenJobIds: [],
		skillChanges: {},
		addedSkills: [],
		textOverrides: {}
	});
	let saveMessage = $state('');
	let saveError = $state('');
	let isSaving = $state(false);

	$effect(() => {
		const nextVariant = structuredClone(data.variant);
		nextVariant.textOverrides ??= {};
		variant = nextVariant;
		selectedSummaryIndex =
			(nextVariant.textOverrides.summaryParagraphs ?? data.cv.summary.paragraphs).length > 0
				? 0
				: -1;
		selectedBulletIndexes = Object.fromEntries(
			data.cv.experience.jobs.map((job) => {
				const bullets = nextVariant.textOverrides?.experienceBullets?.[job.id] ?? job.bullets;
				return [job.id, bullets.length > 0 ? 0 : -1];
			})
		);
	});

	const sections: { id: CvSection; label: string; emoji: string; description: string }[] = [
		{
			id: 'header',
			label: 'Header & contact',
			emoji: '👤',
			description: 'Tailor your role and introduction; identity and contact facts stay read-only.'
		},
		{
			id: 'commercialImpact',
			label: 'Commercial impact',
			emoji: '📈',
			description: 'Review measurable outcomes and business impact.'
		},
		{
			id: 'summary',
			label: 'Summary',
			emoji: '📝',
			description: 'Tailor the professional overview for this CV variant.'
		},
		{
			id: 'experience',
			label: 'Experience',
			emoji: '💼',
			description: 'Review roles and tailor experience wording for this CV variant.'
		},
		{
			id: 'skills',
			label: 'Skills',
			emoji: '🧰',
			description: 'Review skills from the main CV; factual skill claims are read-only.'
		},
		{
			id: 'education',
			label: 'Education',
			emoji: '🎓',
			description: 'Review qualifications and education details from the main CV.'
		}
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

	function updateHeaderText(key: 'headerRole' | 'headerSubtitle', value: string) {
		variant.textOverrides = { ...variant.textOverrides, [key]: value };
	}

	function removeStaleJobOverride(id: string) {
		variant.hiddenJobIds = variant.hiddenJobIds.filter((jobId) => jobId !== id);
	}

	function summaryParagraphs(): string[] {
		return variant.textOverrides?.summaryParagraphs ?? data.cv.summary.paragraphs;
	}

	function updateSummaryParagraph(index: number, value: string) {
		const paragraphs = [...summaryParagraphs()];
		paragraphs[index] = value;
		variant.textOverrides = { ...variant.textOverrides, summaryParagraphs: paragraphs };
	}

	function addSummaryParagraph() {
		selectedSummaryIndex = summaryParagraphs().length;
		variant.textOverrides = {
			...variant.textOverrides,
			summaryParagraphs: [...summaryParagraphs(), '']
		};
	}

	function removeSummaryParagraph(index: number) {
		selectedSummaryIndex = selectedIndexAfterRemoval(
			selectedSummaryIndex,
			index,
			summaryParagraphs().length - 1
		);
		variant.textOverrides = {
			...variant.textOverrides,
			summaryParagraphs: summaryParagraphs().filter((_, paragraphIndex) => paragraphIndex !== index)
		};
	}

	function experienceBullets(jobId: string): ExperienceBullet[] {
		return (
			variant.textOverrides?.experienceBullets?.[jobId] ??
			data.cv.experience.jobs.find((job) => job.id === jobId)?.bullets ??
			[]
		);
	}

	function updateExperienceBullets(jobId: string, bullets: ExperienceBullet[]) {
		variant.textOverrides = {
			...variant.textOverrides,
			experienceBullets: {
				...variant.textOverrides?.experienceBullets,
				[jobId]: bullets
			}
		};
	}

	function updateExperienceBullet(jobId: string, index: number, bullet: ExperienceBullet) {
		const bullets = [...experienceBullets(jobId)];
		bullets[index] = bullet;
		updateExperienceBullets(jobId, bullets);
	}

	function addExperienceBullet(jobId: string) {
		selectedBulletIndexes[jobId] = experienceBullets(jobId).length;
		updateExperienceBullets(jobId, [...experienceBullets(jobId), { content: '' }]);
	}

	function removeExperienceBullet(jobId: string, index: number) {
		selectedBulletIndexes[jobId] = selectedIndexAfterRemoval(
			selectedBulletIndexes[jobId],
			index,
			experienceBullets(jobId).length - 1
		);
		updateExperienceBullets(
			jobId,
			experienceBullets(jobId).filter((_, bulletIndex) => bulletIndex !== index)
		);
	}

	function removeStaleSkillOverride(id: string) {
		const changes = { ...variant.skillChanges };
		delete changes[id];
		variant.skillChanges = changes;
	}

	function skillLabel(id: string, label: string): string {
		const change = variant.skillChanges[id];
		return change?.kind === 'replacement' ? change.label : label;
	}

	function skillValue(id: string, value: string): string {
		const change = variant.skillChanges[id];
		return change?.kind === 'replacement' ? change.value : value;
	}

	function skillHidden(id: string): boolean {
		return variant.skillChanges[id]?.kind === 'hidden';
	}

	function setSkillHidden(id: string, hidden: boolean) {
		const changes = { ...variant.skillChanges };
		if (hidden) changes[id] = { kind: 'hidden' };
		else if (changes[id]?.kind === 'hidden') delete changes[id];
		variant.skillChanges = changes;
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

<main class="cv-workspace mx-auto min-h-screen w-full max-w-[88ch] px-4 py-6">
	<WorkspaceNavigation active="editor" variantId={variant.id} />
	<section class="cv-tools space-y-6" aria-label="CV variant editor">
		<section class="cv-editor-section">
			<h2>Edit CV variant</h2>
			<p>
				Factual details inherit from the main CV and are read-only. You can tailor the summary and
				experience wording for this variant.
			</p>
			<label class="cv-editor-field">
				Name <input bind:value={variant.name} required maxlength="100" />
			</label>
		</section>

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
					onclick={() => (selectedSection = section.id)}
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

		<section class="cv-editor-section">
			<h2>{sections.find((section) => section.id === selectedSection)?.label}</h2>
			<label class="cv-editor-checkbox">
				<input
					type="checkbox"
					checked={!sectionHidden(selectedSection)}
					onchange={(event) => setSectionHidden(selectedSection, !event.currentTarget.checked)}
				/>
				Include this section in the variant
			</label>
			{#if selectedSection !== 'header'}
				<label class="cv-editor-field">
					Section title override
					<input
						value={variant.sectionTitles[selectedSection] ?? ''}
						placeholder={data.cv[selectedSection].title}
						disabled={sectionHidden(selectedSection)}
						oninput={(event) => updateSectionTitle(selectedSection, event.currentTarget.value)}
					/>
				</label>
			{/if}

			{#if selectedSection === 'header'}
				<label class="cv-editor-field">
					Name <input value={data.cv.header.name} readonly />
				</label>
				<label class="cv-editor-field">
					Role
					<input
						value={variant.textOverrides?.headerRole ?? data.cv.header.role}
						disabled={sectionHidden('header')}
						oninput={(event) => updateHeaderText('headerRole', event.currentTarget.value)}
					/>
				</label>
				<label class="cv-editor-field">
					Introduction
					<textarea
						value={variant.textOverrides?.headerSubtitle ?? data.cv.header.subtitle}
						disabled={sectionHidden('header')}
						oninput={(event) => updateHeaderText('headerSubtitle', event.currentTarget.value)}
					></textarea>
				</label>
				<h3>Relocation notes</h3>
				{#each data.cv.header.relocation as note, index (index)}
					<label class="cv-editor-field">
						Note <input value={note} readonly />
					</label>
				{/each}
				<h3>Links</h3>
				{#each data.cv.header.links as link, index (index)}
					<div class="cv-editor-entry">
						<label class="cv-editor-field">
							Label <input value={link.label} readonly />
						</label>
						<label class="cv-editor-field">
							URL <input value={link.href} readonly />
						</label>
					</div>
				{/each}
			{:else if selectedSection === 'commercialImpact'}
				{#each data.cv.commercialImpact.highlights as highlight, index (index)}
					<label class="cv-editor-field">
						Impact highlight <textarea value={highlight} readonly></textarea>
					</label>
				{/each}
			{:else if selectedSection === 'summary'}
				<p>Summary wording is editable for this variant; the main CV remains unchanged.</p>
				<ItemSelector
					items={summaryParagraphs()}
					bind:selectedIndex={selectedSummaryIndex}
					itemLabel="summary paragraph"
					ariaLabel="Summary paragraphs"
					onAdd={addSummaryParagraph}
					disabled={sectionHidden('summary')}
				/>
				{#if selectedSummaryIndex >= 0}
					{@const paragraph = summaryParagraphs()[selectedSummaryIndex]}
					<div class="cv-editor-entry">
						<label class="cv-editor-field">
							Paragraph
							<textarea
								class="cv-editor-field-long"
								value={paragraph}
								disabled={sectionHidden('summary')}
								oninput={(event) =>
									updateSummaryParagraph(selectedSummaryIndex, event.currentTarget.value)}
							></textarea>
						</label>
						<button
							class="cv-editor-button cv-editor-button-danger"
							type="button"
							disabled={sectionHidden('summary')}
							onclick={() => removeSummaryParagraph(selectedSummaryIndex)}>Remove paragraph</button
						>
					</div>
				{/if}
			{:else if selectedSection === 'experience'}
				{#each variant.hiddenJobIds.filter((id) => !data.cv.experience.jobs.some((job) => job.id === id)) as staleId (staleId)}
					<p class="text-amber-200">
						A hidden job no longer exists in the main CV.
						<button class="underline" type="button" onclick={() => removeStaleJobOverride(staleId)}>
							Remove stale override
						</button>
					</p>
				{/each}
				{#each data.cv.experience.jobs as job (job.id)}
					{@const bullets = experienceBullets(job.id)}
					<div class="cv-editor-entry">
						<label class="cv-editor-checkbox">
							<input
								type="checkbox"
								checked={!jobHidden(job.id)}
								onchange={(event) => setJobHidden(job.id, !event.currentTarget.checked)}
							/>
							Show {job.role || 'Untitled role'} — {job.company || 'Untitled company'}
						</label>
						<label class="cv-editor-field">
							Role <input value={job.role} readonly />
						</label>
						<label class="cv-editor-field">
							Company <input value={job.company} readonly />
						</label>
						<label class="cv-editor-field">
							Dates <input value={job.dates} readonly />
						</label>
						<label class="cv-editor-field">
							Location <input value={job.location} readonly />
						</label>
						<h3>Experience wording</h3>
						<ItemSelector
							items={bullets.map((bullet) => bullet.content.replaceAll('##', ''))}
							bind:selectedIndex={selectedBulletIndexes[job.id]}
							itemLabel="experience wording"
							ariaLabel={`${job.role || 'Job'} experience wording`}
							onAdd={() => addExperienceBullet(job.id)}
							disabled={jobHidden(job.id)}
						/>
						{#if selectedBulletIndexes[job.id] >= 0}
							{@const bullet = bullets[selectedBulletIndexes[job.id]]}
							<div class="cv-editor-entry">
								<label class="cv-editor-checkbox">
									<input
										type="checkbox"
										checked={bullet.paragraph ?? false}
										disabled={jobHidden(job.id)}
										onchange={(event) =>
											updateExperienceBullet(job.id, selectedBulletIndexes[job.id], {
												...bullet,
												paragraph: event.currentTarget.checked
											})}
									/>
									Use paragraph spacing
								</label>
								<label class="cv-editor-field">
									Bullet wording
									<textarea
										class="cv-editor-field-long"
										value={bullet.content}
										disabled={jobHidden(job.id)}
										oninput={(event) =>
											updateExperienceBullet(job.id, selectedBulletIndexes[job.id], {
												...bullet,
												content: event.currentTarget.value
											})}></textarea>
								</label>
								<button
									class="cv-editor-button cv-editor-button-danger"
									type="button"
									disabled={jobHidden(job.id)}
									onclick={() => removeExperienceBullet(job.id, selectedBulletIndexes[job.id])}
									>Remove wording</button
								>
							</div>
						{/if}
					</div>
				{/each}
			{:else if selectedSection === 'skills'}
				{#each Object.keys(variant.skillChanges).filter((id) => !data.cv.skills.skills.some((skill) => skill.id === id)) as staleId (staleId)}
					<p class="text-amber-200">
						A skill-row override no longer matches the main CV.
						<button
							class="underline"
							type="button"
							onclick={() => removeStaleSkillOverride(staleId)}
						>
							Remove stale override
						</button>
					</p>
				{/each}
				{#each data.cv.skills.skills as skill (skill.id)}
					<div class="cv-editor-entry">
						<label class="cv-editor-checkbox">
							<input
								type="checkbox"
								checked={!skillHidden(skill.id)}
								onchange={(event) => setSkillHidden(skill.id, !event.currentTarget.checked)}
							/>
							Show this skill group
						</label>
						<label class="cv-editor-field">
							Skill group <input value={skillLabel(skill.id, skill.label)} readonly />
						</label>
						<label class="cv-editor-field">
							Skills <textarea value={skillValue(skill.id, skill.value)} readonly></textarea>
						</label>
						{#if skillHidden(skill.id)}
							<p>This row is hidden in the variant.</p>
						{/if}
					</div>
				{/each}
				{#each variant.addedSkills as skill (skill.id)}
					<div class="cv-editor-entry">
						<label class="cv-editor-field">
							Skill group <input value={skill.label} readonly />
						</label>
						<label class="cv-editor-field">
							Skills <textarea value={skill.value} readonly></textarea>
						</label>
					</div>
				{/each}
			{:else}
				{#each data.cv.education.entries as entry, index (index)}
					<div class="cv-editor-entry">
						<label class="cv-editor-field">
							Qualification <input value={entry.qualification} readonly />
						</label>
						<label class="cv-editor-field">
							Institution <input value={entry.institution} readonly />
						</label>
						<label class="cv-editor-field">
							Date <input value={entry.date} readonly />
						</label>
						<label class="cv-editor-field">
							Location <input value={entry.location} readonly />
						</label>
						<label class="cv-editor-field">
							Specialization <input value={entry.specialization} readonly />
						</label>
					</div>
				{/each}
			{/if}
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
