<script lang="ts">
	import data from '#lib/data/cv/education.json';
</script>

<section>
	<h2>{data.title}</h2>
	{#each data.entries as entry}
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
