<script lang="ts">
	import CvDocument from '#lib/components/cv/CvDocument.svelte';
	import PrintPreview from '#lib/components/cv/PrintPreview.svelte';
	import WorkspaceNavigation from '#lib/components/cv/WorkspaceNavigation.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<svelte:head>
	<title>Print preview - CV - Ulf Dellbrügge</title>
</svelte:head>

<div class="mx-auto w-full max-w-[75ch] px-4 py-6">
	<WorkspaceNavigation active="preview" variantId={data.variantId ?? undefined} />
	<PrintPreview />
	<CvDocument data={data.cv} hiddenSections={data.hiddenSections} />
</div>
