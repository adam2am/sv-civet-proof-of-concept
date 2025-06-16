<script lang="civet">
	import '../app.css';
	// SvelteKit automatically passes the return value of `load` from
	// `+layout.civet` here
	{ children, data } .= $props()

</script>

<div data-theme="light">
	{@render children()}
</div>