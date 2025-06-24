<script lang="civet">
	'../app.css'
	{ showcaseData } from '$lib/showcase-data'
	ShowcaseCard from '$lib/ShowcaseCard.svelte'
	LiveDemo from '$lib/LiveDemo.svelte'
	type { User } from '$lib/types'
	CivetPlayground from '$lib/CivetPlayground.svelte'
	
	{ data }: { data: { streamed: { users: Promise<User[]> } } } .= $props()
</script>

<main class="container mx-auto p-8 md:p-16 flex flex-col gap-20">
	<header class="text-center mb-8">
		<h1 class="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-info to-primary bg-clip-text text-transparent mb-2">
			✨ Civet & TypeScript
		</h1>
		<p class="text-xl text-base-content/70 mb-4">A Developer Experience Showcase</p>
		<div class="flex justify-center gap-4">
			<span class="badge badge-outline badge-lg text-primary gap-1">🐱 Civet</span>
			<span class="badge badge-outline badge-lg text-secondary gap-1">🔥 Svelte 5</span>
			<span class="badge badge-outline badge-lg text-info gap-1">🔷 TypeScript</span>
		</div>
	</header>

	<section class="flex flex-col gap-16">
		{#each showcaseData as data}
			<ShowcaseCard {...data} />
		{/each}
	</section>

	<h2 class="text-3xl font-bold text-center text-base-content/90 mt-16 mb-10 pb-4 border-b border-base-300">👀 Live Demo</h2>
	{#await data.streamed.users}
		<div class="text-center p-8 flex flex-col items-center gap-4">
			<span class="loading loading-lg loading-spinner text-primary"></span>
			<p class="text-base-content/70">Fetching live demo data...</p>
		</div>
	{:then users}
		<LiveDemo users={users} />
	{:catch error}
		<div class="alert alert-error">
			<p>Could not load live demo: {error.message}</p>
		</div>
	{/await}

	<h2 class="text-3xl font-bold text-center text-base-content/90 mt-16 mb-10 pb-4 border-b border-base-300">✏️ Live Civet Playground</h2>
	<CivetPlayground />
</main>