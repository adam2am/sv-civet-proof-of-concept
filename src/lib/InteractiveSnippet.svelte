<script lang="civet">
	import { onMount, createEventDispatcher, tick } from 'svelte'
	import { compile } from '@danielx/civet'
	import Prism from 'prismjs'
	import 'prismjs/components/prism-typescript'
	import 'prismjs/components/prism-coffeescript'
	import 'prismjs/themes/prism-tomorrow.css'

	// Props
	{ initialCode, language = 'civet', editable = false } := $props<{ initialCode: string, language?: 'civet' | 'typescript', editable?: boolean }>()

	// State
	codeState .= $state<string>(initialCode.startsWith('\n') ? initialCode.slice(1) : initialCode)
	textareaRef .= $state<HTMLTextAreaElement | null>(null)
	preRef .= $state<HTMLPreElement | null>(null)
	dispatch := createEventDispatcher<{ compiled: string, compileError: { message: string, line: number, column: number } }>()

	// Compile options
	compileOpts := {
		js: false,
		parseOptions: {
			coffeeIsnt: true,
			coffeeEq: true,
			coffeeBooleans: true,
			coffeeInterpolation: true
		}
	}

	// Compile Civet to TypeScript
	compileNow := async =>
		if language is 'civet'
			try
				compiled := await compile(codeState, compileOpts) as string
				dispatch 'compiled', compiled
			catch err
				// Dispatch compileError event with trimmed message
				rawMsg := (err as Error).message
				// Remove the lengthy 'Expected:' block
				trimmedMsg := rawMsg.split('Expected:')[0].trim()
				dispatch 'compileError', {
					message: trimmedMsg,
					line: (err as any).line ?? 0,
					column: (err as any).column ?? 0
				}

	// Update the editor's innerHTML with highlighted code
	updateHighlight := ->
		if not preRef return
		prismLang := if language is 'civet' then Prism.languages.coffeescript else Prism.languages.typescript
		alias := if language is 'civet' then 'coffeescript' else 'typescript'
		highlighted := Prism.highlight(codeState, prismLang, alias)
		if preRef.innerHTML isnt highlighted
			preRef.innerHTML = highlighted

	// Handle Tab key for indentation
	handleKeydown := (e: KeyboardEvent) ->
		if e.key is 'Tab' and editable
			e.preventDefault()
			ta := e.currentTarget as HTMLTextAreaElement
			start := ta.selectionStart
			end := ta.selectionEnd
			value := ta.value
			tabStr := '  '
			if e.shiftKey
				lineStart := value.lastIndexOf('\n', start - 1) + 1
				if value.substring(lineStart, lineStart + tabStr.length) is tabStr
					ta.value = value.substring(0, lineStart) + value.substring(lineStart + tabStr.length)
					ta.selectionStart = ta.selectionEnd = start - tabStr.length
			else
				ta.value = value.substring(0, start) + tabStr + value.substring(end)
				ta.selectionStart = ta.selectionEnd = start + tabStr.length
			ta.dispatchEvent new Event('input', { bubbles: true })

	// Set initial content and compile
	onMount async =>
		updateHighlight()
		await compileNow()

	// Re-compile and re-highlight when code changes, then sync scroll
	$effect ->
		codeState
		updateHighlight()
		if language is 'civet'
			void compileNow()

		ta := textareaRef
		pre := preRef
		if not ta or not pre then return
		sync := ->
			pre.scrollTop = ta.scrollTop
			pre.scrollLeft = ta.scrollLeft
		ta.addEventListener 'scroll', sync
		ta.addEventListener 'input', sync
		sync()
		->
			ta.removeEventListener 'scroll', sync
			ta.removeEventListener 'input', sync

	// No longer needed as textarea binding updates codeState automatically

	// Adjust style maybe keep but fine.
</script>

<div class="relative h-full bg-[#0f172a] font-mono">
	{#if editable}
		<textarea
			bind:this={textareaRef}
			bind:value={codeState}
			onkeydown={handleKeydown}
			spellcheck="false"
			autocomplete="off"
			class="absolute inset-0 w-full h-full p-6 text-sm bg-transparent text-transparent caret-primary focus:outline-none resize-none overflow-auto whitespace-pre-wrap break-words selection:bg-primary/30 selection:text-[#e2e8f0] z-10"
			style="color:transparent; -webkit-text-fill-color:transparent;"
		></textarea>
	{/if}
	<pre
		bind:this={preRef}
		class="w-full h-full m-0 p-6 text-sm text-[#e2e8f0] overflow-auto !bg-[#0f172a] pointer-events-none whitespace-pre-wrap break-words">
		<code>{@html Prism.highlight(codeState, language === 'civet' ? Prism.languages.coffeescript : Prism.languages.typescript, language === 'civet' ? 'coffeescript' : 'typescript')}</code>
	</pre>
</div>

<style>
	:global(.token) { font-family: inherit !important; }
	:global(.token.comment) { color: #94a3b8; }
	:global(.token.string),
	:global(.token.string-interpolation) { color: #86efac; }
	:global(.token.number) { color: #fdba74; }
	:global(.token.keyword) { color: #c084fc; }
	:global(.token.function) { color: #93c5fd; }
	:global(.token.operator),
	:global(.token.punctuation) { color: #94a3b8; }

	/* Custom Scrollbar Styling */
	:global(pre::-webkit-scrollbar) { width: 12px; }
	:global(pre::-webkit-scrollbar-track) { background: #1e293b; }
	:global(pre::-webkit-scrollbar-thumb) {
		background-color: #334155;
		border-radius: 20px;
		border: 3px solid #1e293b;
	}
</style> 