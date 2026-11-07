<script lang="ts">
	import type { Education } from '#lib/types/cv.js';

	let { data }: { data: Education } = $props();
</script>

<section>
	<h2>{data.title}</h2>
	{#each data.entries as entry, index (index)}
		<div class="education entry">
			<h3>
				<span>{entry.qualification}</span>
				<span class="dash"></span>
				<span>{entry.institution}</span>
			</h3>
			<h4>
				<span>{entry.date}</span>
				<span class="dash"></span>
				<span>{entry.location}</span>
			</h4>
			<p>Specialization: {entry.specialization}</p>
		</div>
	{/each}
</section>
