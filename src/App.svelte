<script lang="ts">
	import CommandWindow from './components/CommandWindow.svelte';
</script>

<main class="flex flex-col v-screen h-screen">
	<h1 class="sr-only">Simple Turtle Graphics</h1>
	<div class="flex-auto"></div>
	<CommandWindow/>
</main>

<style global lang="postcss">
	@tailwind base;
	@tailwind components;
	@tailwind utilities;
</style>
