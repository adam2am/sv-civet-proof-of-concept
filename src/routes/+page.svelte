<script lang="civet">
	import '../app.css'
	import ShowcaseCard from '$lib/ShowcaseCard.svelte'
	import LiveDemo from '$lib/LiveDemo.svelte'
	import type { User } from '$lib/types'
	import { showcaseData } from '$lib/showcase-data'
	import CivetPlayground from '$lib/CivetPlayground.svelte'

	{ data }: { data?: { users: User[] } } .= $props()
</script>

<main class="container mx-auto p-8 md:p-16 flex flex-col gap-20">
	<header class="text-center mb-8">
		<h1 class="text-4xl font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
			✨ Civet vs. TypeScript
		</h1>
		<p class="text-xl text-base-content/70 mb-4">A Developer Experience Showcase</p>
		<div class="flex justify-center gap-3">
			<span class="badge badge-outline text-primary gap-1">🐱 Civet</span>
			<span class="badge badge-outline text-secondary gap-1">🔥 Svelte&nbsp;5</span>
			<span class="badge badge-outline text-info gap-1">🔷 TypeScript</span>
		</div>
	</header>

	<section class="flex flex-col gap-16">
		{#each showcaseData as data}
			<ShowcaseCard {...data} />
		{/each}
	</section>

	{#if data?.users}
		<h2 class="text-3xl font-bold text-center text-base-content/90 mt-16 mb-10 pb-4 border-b border-base-300">👀 Live Demo</h2>
		<LiveDemo users={data.users} />
	{/if}

	<h2 class="text-3xl font-bold text-center text-base-content/90 mt-16 mb-10 pb-4 border-b border-base-300">✏️ Live Civet Playground</h2>
	<CivetPlayground />
</main>