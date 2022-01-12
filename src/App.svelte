<script lang="ts">
	import CommandWindow from './components/CommandWindow.svelte';
	import DrawingWindow from './components/DrawingWindow.svelte';
</script>

<main class="flex flex-col v-screen h-screen">
	<h1 class="sr-only">Simple Turtle Graphics</h1>
	<DrawingWindow/>
	<CommandWindow/>
</main>

<style global lang="postcss">
	@tailwind base;
	@tailwind components;
	@tailwind utilities;
</style>
