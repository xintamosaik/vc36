<script lang="ts">
	import CvDocument from '#lib/components/cv/CvDocument.svelte';
	import PrintPreview from '#lib/components/cv/PrintPreview.svelte';
</script>

<svelte:head>
	<title>CV - Ulf Dellbrügge</title>
</svelte:head>

<div
	class="cv-workspace mx-auto grid min-h-screen w-full grid-cols-1 items-start justify-center gap-8 px-4 py-6 min-[1200px]:w-fit min-[1200px]:grid-cols-[60ch_60ch] min-[1200px]:px-0"
>
	<aside class="cv-tools w-full max-w-[60ch]">Buttons to come</aside>
	<section class="cv-preview w-full max-w-[60ch]">
		<PrintPreview />
		<CvDocument />
	</section>
</div>
