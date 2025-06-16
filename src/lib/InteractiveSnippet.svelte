<script lang="civet">
	import { onMount, createEventDispatcher } from 'svelte'
	import { compile } from '@danielx/civet'
	import Prism from 'prismjs'
	import 'prismjs/components/prism-typescript'
	import 'prismjs/components/prism-coffeescript'

	// Props
	{ initialCode, language = 'civet', editable = false } := $props<{ initialCode: string, language?: 'civet' | 'typescript', editable?: boolean }>()

	codeState .= $state<string>(initialCode)
	highlighted .= $state<string>('')
	textareaRef .= $state<HTMLTextAreaElement | null>(null)
	preRef .= $state<HTMLPreElement | null>(null)
	dispatch := createEventDispatcher<{ compiled: string }>()

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

	compileNow := async =>
		if language is 'civet'
			try
				compiled := await compile(codeState, compileOpts) as string
				dispatch 'compiled', compiled
			catch err
				// ignore compile errors in showcase

	updateHighlight := ->
		prismLang := if language is 'civet' then Prism.languages.coffeescript else Prism.languages.typescript
		alias := if language is 'civet' then 'coffeescript' else 'typescript'
		highlighted = Prism.highlight(codeState, prismLang, alias)

	onMount async =>
		updateHighlight()
		await compileNow()

	// Reactive effect: re-highlight and (for civet) recompile on code changes
	$effect ->
		codeState
		updateHighlight()
		if language is 'civet'
			void compileNow()

	// Sync scroll
	$effect ->
		ta := textareaRef
		pre := preRef
		if not ta or not pre then return
		sync := ->
			pre.scrollTop = ta.scrollTop
			pre.scrollLeft = ta.scrollLeft
		ta.addEventListener 'scroll', sync
		sync()
		-> ta.removeEventListener 'scroll', sync

	// Handle Tab key for indentation when editable
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
</script>

<div class="snippet {language} {editable ? 'editable' : 'readonly'}">
	{#if editable}
		<textarea 
        bind:this={textareaRef} 
        bind:value={codeState} 
        onkeydown={handleKeydown} 
        spellcheck="false" 
        autocomplete="off"></textarea>
	{/if}
	<pre bind:this={preRef}><code>{@html highlighted}</code></pre>
</div>

<style>
	.snippet {
		position: relative;
		height: 100%;
	}

	textarea,
	pre {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		margin: 0;
		padding: 1rem;
		font-family: "Fira Code", monospace;
		font-size: 0.875rem;
		line-height: 1.5;
		box-sizing: border-box;
		overflow: auto;
		white-space: pre-wrap;
		word-wrap: break-word;
		border: none;
	}

	textarea {
		resize: none;
		background: transparent;
		color: transparent;
		caret-color: #e2e8f0;
		z-index: 1;
		scrollbar-width: none;
	}
	textarea::-webkit-scrollbar { display:none }

	pre {
		pointer-events: none;
		background: #0f172a;
		color: #e2e8f0;
	}
</style> 