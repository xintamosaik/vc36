<script lang="ts">
	import CommercialImpact from '#lib/components/cv/CommercialImpact.svelte';
	import CvHeader from '#lib/components/cv/CvHeader.svelte';
	import Education from '#lib/components/cv/Education.svelte';
	import Experience from '#lib/components/cv/Experience.svelte';
	import Skills from '#lib/components/cv/Skills.svelte';
	import Summary from '#lib/components/cv/Summary.svelte';
</script>

<main>
	<CvHeader />
	<CommercialImpact />
	<Summary />
	<Experience />
	<Skills />
	<Education />
</main>

<style>
	/* Restore document defaults affected by Tailwind Preflight. */
	main {
		line-height: normal;
		font-family: 'Helvetica', 'Verdana', 'Roboto', 'Arial', sans-serif;
		margin: 0;
		font-size: 9pt;
		padding-top: 1em;
		border-right: 1ch yellow solid;
		max-width: 210mm;
	}

	main :global(:where(h1, h2, h3, h4, p, ul)) {
		margin: revert;
		font-size: revert;
		font-weight: revert;
	}

	main :global(ul) {
		list-style-type: disc;
		padding-inline-start: 4ch;
	}

	main :global(strong) {
		font-weight: bolder;
	}

	main :global(p) {
		margin-top: 6pt;
	}

	main :global(li),
	main :global(p) {
		line-height: 1.7;
	}

	main :global(a) {
		color: rgb(7, 43, 94);
		text-decoration: none;
	}

	main :global(a:hover) {
		text-decoration: underline;
	}

	main :global(h1),
	main :global(h2),
	main :global(h3),
	main :global(h4),
	main :global(p) {
		margin-bottom: 0;
	}

	main :global(h1),
	main :global(h2),
	main :global(h3) {
		text-transform: uppercase;
	}

	main :global(h1) {
		margin-top: 0;
		font-size: 18pt;
	}

	main :global(h2) {
		margin-top: 28pt;
		font-size: 16pt;
	}

	main :global(h3) {
		margin-top: 16pt;
		font-size: 14pt;
	}

	main :global(h4) {
		font-weight: normal;
		font-style: italic;
		margin-top: 4pt;
		font-size: 11pt;
	}

	main :global(section#title),
	main :global(section.contact) {
		display: flex;
		gap: 1ch;
	}

	main :global(.dash:before) {
		content: '\00B7';
	}

	@media print {
		@page {
			size: A4;
		}

		main {
			margin-left: 10mm;
			margin-right: 10mm;
			border: none;
		}

		main :global(ul li) {
			page-break-inside: avoid;
		}
	}
</style>
