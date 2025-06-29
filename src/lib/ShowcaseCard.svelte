<script lang="civet">
	import InteractiveSnippet from './InteractiveSnippet.svelte'
	import { onMount, tick } from 'svelte'

	type Props =
		title: string
		wowConcept: string
		explanation: string
		civetCode: string

	{ title, wowConcept, explanation, civetCode } .= $props()

	compiledTs .= $state<string>('')
	errorInfo .= $state<{ message: string, line: number, column: number } | null>(null)
	civetError .= $state<{ message: string, line: number, column: number } | null>(null)
	snippetsVisible .= $state(false)

	// Lazy-load Prettier only in the browser to keep bundle lighter
	prettierRef .= $state<any>(null)
	parserTsRef .= $state<any>(null)
	parserEstreeRef .= $state<any>(null)

	ensurePrettierLoaded := async ->
		if prettierRef then return
		prettierRef = await import('prettier/standalone')
		parserTsRef = await import('prettier/plugins/typescript')
		parserEstreeRef = await import('prettier/plugins/estree')

	// Derived output that injects error indicator when errorInfo is present
	displayTs := $derived do
		if not errorInfo? or not compiledTs
			compiledTs
		else
			lines := compiledTs.split('\n')
			errLine := errorInfo.line
			errCol := errorInfo.column
			// Clamp line number to be inside the bounds of the (potentially stale) TS code
			lineIndex := Math.max(0, Math.min(errLine - 1, lines.length))
			indicator := `// ${' '.repeat(Math.max(0, errCol - 1))}^-- [L${errLine}:${errCol}] ${errorInfo.message}`
			lines.splice(lineIndex + 1, 0, indicator)
			lines.join('\n')

	handleCompiled := async (compiledCode: string) ->
		try
			// Format the TypeScript with Prettier
			await ensurePrettierLoaded()
			formatted := await prettierRef.format(compiledCode, {
				parser: 'typescript',
				plugins: [parserEstreeRef, parserTsRef],
				semi: false,
				singleQuote: true,
				printWidth: 80
			})
			
			compiledTs = formatted.trim()
			errorInfo = null
		catch err
			// If Prettier fails, still show the unformatted TypeScript
			compiledTs = compiledCode
			errorInfo = { message: (err as Error).message, line: 0, column: 0 }
		
		await tick()
		snippetsVisible = true

	handleCompileError := async (err: { message: string, line: number, column: number }) ->
		// Civet compilation error
		errorInfo = { message: err.message, line: err.line, column: err.column }
		civetError = { message: err.message, line: err.line, column: err.column }

		await tick()
		snippetsVisible = true

	// Initial compilation
	onMount async ->
		// InteractiveSnippet will handle the initial compilation
		// and trigger handleCompiled via the 'compiled' event
</script>

<article class="card bg-gradient-to-br from-base-100 to-base-200 shadow-xl border border-primary/20 transition-all duration-300 hover:shadow-primary/20 hover:border-primary/40">
	<header class="card-body border-b border-base-300">
		<h3 class="card-title text-2xl">{title}</h3>
		<p class="text-base-content/70">
			<span class="font-semibold text-primary">Main Concept:</span> {wowConcept}
		</p>
	</header>

	<div class="card-body py-6">
		<p class="text-base-content/80">{explanation}</p>
	</div>

	<div class="grid grid-cols-1 md:grid-cols-2 bg-[#1e293b] gap-px rounded-b-2xl overflow-hidden">
		<div class="flex flex-col flex-1">
			<h4 class="py-2 px-6 flex items-center gap-2 text-[#e2e8f0] text-sm bg-[#1e293b] font-semibold">
				🐱 Civet <span class="text-lg">✏️</span>
				<span class="text-xs text-sky-100">(editable)</span>
			</h4>
			<div class="flex-1">
				<InteractiveSnippet
					initialCode={civetCode}
					editable
					language="civet"
					reveal={snippetsVisible}
					onCompiled={handleCompiled}
					onCompileError={handleCompileError}
				/>
				{#if civetError}
					<p class="text-error text-xs p-2">⚠️ L{civetError.line}:{civetError.column} {civetError.message}</p>
				{/if}
			</div>
		</div>

		<div class="flex flex-col flex-1">
			<h4 class="py-2 px-6 flex items-center gap-2 text-[#e2e8f0] text-sm bg-[#1e293b] font-semibold">
				🔷 TypeScript <span class="text-lg">🔒</span>
				<span class="text-xs text-slate-400">(compiled output)</span>
			</h4>
			<div class={`flex-1 ${errorInfo ? 'bg-error/10' : ''}`}>
				{#key displayTs}
					<InteractiveSnippet
						initialCode={displayTs}
						language="typescript"
						reveal={snippetsVisible}
					/>
				{/key}
			</div>
		</div>
	</div>
</article> 