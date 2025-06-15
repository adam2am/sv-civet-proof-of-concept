<script lang="civet">
	type Props =
		title: string
		wowConcept: string
		explanation: string
		civetCode: string
		tsCode: string

	{ title, wowConcept, explanation, civetCode, tsCode } .= $props()

	// Import Svelte lifecycle
	import { onMount } from 'svelte'

	// Load Prism.js for syntax highlighting once the component mounts
	onMount async =>
		// Dynamically import Prism core
		Prism := await import('prismjs')
		// Load only the languages we need (TypeScript & CoffeeScript - closest to Civet)
		// @ts-expect-error: No type declarations required for runtime highlight
		await import('prismjs/components/prism-typescript.js')
		// @ts-expect-error: No type declarations required for runtime highlight
		await import('prismjs/components/prism-coffeescript.js')
		Prism.highlightAll()
</script>

<div class="showcase-card">
	<div class="header">
		<h3 class="title">{title}</h3>
		<p class="wow-concept">
			<span class="highlight">Main Concept:</span> {wowConcept}
		</p>
	</div>
	<p class="explanation">{explanation}</p>
	<div class="code-comparison">
		<div class="code-block">
			<h4>🐱 Civet</h4>
			<pre class="language-coffeescript"><code class="language-coffeescript">{civetCode}</code></pre>
		</div>
		<div class="code-block">
			<h4>🔷 TypeScript</h4>
			<pre class="language-typescript"><code class="language-typescript">{tsCode}</code></pre>
		</div>
	</div>
</div>

<style>
	@import 'prismjs/themes/prism-tomorrow.css';
	.showcase-card {
		background: #fff;
		border-radius: 16px;
		border: 1px solid #e2e8f0;
		overflow: hidden;
		box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
		transition: box-shadow 0.3s ease;
	}

	.showcase-card:hover {
		box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
	}

	.header {
		padding: 1.5rem;
		border-bottom: 1px solid #e2e8f0;
		background: #f8fafc;
	}

	.title {
		font-size: 1.5rem;
		font-weight: 600;
		color: #1e293b;
		margin: 0 0 0.5rem;
	}

	.wow-concept {
		margin: 0;
		font-size: 1rem;
		color: #475569;
	}

	.highlight {
		font-weight: 600;
		color: #4f46e5;
	}

	.explanation {
		padding: 1.5rem;
		margin: 0;
		font-size: 1rem;
		line-height: 1.6;
		color: #334155;
	}

	.code-comparison {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0;
		background: #1e293b;
		padding-top: 1rem;
		border-top: 1px solid #e2e8f0;
	}

	.code-block {
		display: flex;
		flex-direction: column;
	}

	.code-block h4 {
		padding: 0.5rem 1.5rem;
		margin: 0;
		color: #cbd5e1;
		font-size: 1rem;
		font-weight: 500;
	}

	.code-block pre {
		margin: 0;
		padding: 1.5rem;
		background-color: #0f172a;
		color: #e2e8f0;
		overflow-x: auto;
		font-family: 'Fira Code', monospace;
		font-size: 0.875rem;
		line-height: 1.5;
		flex-grow: 1;
		white-space: pre-wrap;
	}

	/* Make the code blocks full-width on smaller screens */
	@media (max-width: 900px) {
		.code-comparison {
			grid-template-columns: 1fr;
		}

		.code-block:first-child {
			border-bottom: 2px solid #334155;
		}
	}
</style> 