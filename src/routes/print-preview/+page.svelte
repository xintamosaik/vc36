<script lang="ts">
	import CvDocument from '#lib/components/cv/CvDocument.svelte';
	import PrintPreview from '#lib/components/cv/PrintPreview.svelte';
</script>

<svelte:head>
	<title>Print preview - CV - Ulf Dellbrügge</title>
</svelte:head>

<div class="mx-auto w-full max-w-[75ch] px-4 py-6">
	<PrintPreview />
	<CvDocument />
</div>
