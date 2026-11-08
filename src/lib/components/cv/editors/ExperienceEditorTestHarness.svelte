<script lang="ts">
	import { untrack } from 'svelte';
	import type { Experience } from '#lib/types/cv.js';
	import ExperienceEditor from './ExperienceEditor.svelte';

	let { data }: { data: Experience } = $props();
	let experience = $state(untrack(() => data));
</script>

<ExperienceEditor bind:data={experience} onSave={() => {}} />
