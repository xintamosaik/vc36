<script lang="ts">
	import CommercialImpact from '#lib/components/cv/CommercialImpact.svelte';
	import CvHeader from '#lib/components/cv/CvHeader.svelte';
	import Education from '#lib/components/cv/Education.svelte';
	import Experience from '#lib/components/cv/Experience.svelte';
	import Skills from '#lib/components/cv/Skills.svelte';
	import Summary from '#lib/components/cv/Summary.svelte';
</script>

<svelte:head>
	<title>CV - Ulf Dellbrügge</title>
</svelte:head>

<div class="print-controls">
	<button type="button" onclick={() => window.print()}>Print / Save as PDF</button>
</div>

<main class="cv-document">
	<CvHeader />
	<CommercialImpact />
	<Summary />
	<Experience />
	<Skills />
	<Education />
</main>

<style>
	.print-controls {
		padding: 1rem;
	}

	.print-controls button {
		cursor: pointer;
		border: 1px solid #aaa;
		border-radius: 0.25rem;
		padding: 0.5rem 0.75rem;
	}

	@media print {
		.print-controls {
			display: none;
		}
	}

	:global {
		/* Restore document defaults affected by Tailwind Preflight. */
		.cv-document {
			line-height: normal;
			font-family: 'Helvetica', 'Verdana', 'Roboto', 'Arial', sans-serif;
			margin: 0;
			font-size: 9pt;
			padding-top: 1em;
			border-right: 1ch yellow solid;
			max-width: 210mm;
		}

		.cv-document :where(h1, h2, h3, h4, p, ul) {
			margin: revert;
			font-size: revert;
			font-weight: revert;
		}

		.cv-document ul {
			list-style-type: disc;
			padding-inline-start: 4ch;
		}

		.cv-document strong {
			font-weight: bolder;
		}

		.cv-document p {
			margin-top: 6pt;
		}

		.cv-document li,
		.cv-document p {
			line-height: 1.7;
		}

		.cv-document a {
			color: rgb(7, 43, 94);
			text-decoration: none;
		}

		.cv-document a:hover {
			text-decoration: underline;
		}

		.cv-document h1,
		.cv-document h2,
		.cv-document h3,
		.cv-document h4,
		.cv-document p {
			margin-bottom: 0;
		}

		.cv-document h1,
		.cv-document h2,
		.cv-document h3 {
			text-transform: uppercase;
		}

		.cv-document h1 {
			margin-top: 0;
			font-size: 18pt;
		}

		.cv-document h2 {
			margin-top: 28pt;
			font-size: 16pt;
		}

		.cv-document h3 {
			margin-top: 16pt;
			font-size: 14pt;
		}

		.cv-document h4 {
			font-weight: normal;
			font-style: italic;
			margin-top: 4pt;
			font-size: 11pt;
		}

		.cv-document section#title,
		.cv-document section.contact {
			display: flex;
			gap: 1ch;
		}

		.cv-document .dash:before {
			content: '\00B7';
		}

		@media print {
			@page {
				size: A4;
			}

			.cv-document {
				margin-left: 10mm;
				margin-right: 10mm;
				border: none;
			}

			.cv-document ul li {
				page-break-inside: avoid;
			}
		}
	}
</style>
