<script lang="ts">
	import { parseFatText } from '#lib/fat-text.js';

	let { text }: { text: string } = $props();
</script>

{#each parseFatText(text) as segment, index (index)}
	{#if typeof segment === 'string'}
		{segment}
	{:else}
		<strong>{segment.text}</strong>
	{/if}
{/each}
