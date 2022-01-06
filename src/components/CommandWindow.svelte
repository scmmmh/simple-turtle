<script lang="ts">
    import { onDestroy, tick } from 'svelte';

    import CommandHistory from './CommandHistory.svelte';
    import { commandHistory, activeCommand } from '../store';

    let command = 'Turn Left 90';
    let historyList = null as Element;

    function runCommand(ev: Event) {
        ev.preventDefault();
        parseCommand(command.trim());
    }

    function parseCommand(cmdStr: string) {
        const command = {
            success: false,
            tokens: [],
            action: null,
            params: [],
        };
        cmdStr.split(' ').forEach((tokenStr) => {
            const token = {
                text: tokenStr.substring(0, 1).toUpperCase() + tokenStr.substring(1).toLowerCase(),
                value: tokenStr.toLowerCase(),
                valid: false,
                icon: null,
            };
            if (token.value === 'turn') {
                token.icon = 'turn';
            } else if (token.value === 'left') {
                token.icon = 'left';
            } else if (token.value === 'right') {
                token.icon = 'right';
            } else if (token.value === 'move') {
                token.icon = 'move';
            } else if (token.value === 'forward') {
                token.icon = 'forward';
            } else if (token.value === 'backward') {
                token.icon = 'backward';
            }
            command.tokens.push(token);
        });
        command.tokens.forEach((token) => {
            if (command.action === null && token.value === 'turn') {
                command.action = 'turn';
                token.valid = true;
            } else if (command.action === 'turn' && token.value === 'left' && command.params.length === 0) {
                command.params.push('left');
                token.valid = true;
            } else if (command.action === 'turn' && token.value === 'right' && command.params.length === 0) {
                command.params.push('right');
                token.valid = true;
            } else if (command.action === 'turn' && command.params.length === 1 && !Number.isNaN(Number.parseInt(token.value))) {
                token.value = Number.parseInt(token.value);
                token.text = token.value.toString();
                command.params.push(token.value);
                token.valid = true;
            } else if (command.action === null && token.value === 'move') {
                command.action = 'move';
                token.valid = true;
            } else if (command.action === 'move' && token.value === 'forward' && command.params.length === 0) {
                command.params.push('forward');
                token.valid = true;
            } else if (command.action === 'move' && token.value === 'backward' && command.params.length === 0) {
                command.params.push('backward');
                token.valid = true;
            } else if (command.action === 'move' && command.params.length === 1 && !Number.isNaN(Number.parseInt(token.value))) {
                token.value = Number.parseInt(token.value);
                token.text = token.value.toString();
                command.params.push(token.value);
                token.valid = true;
            }
        });
        command.success = command.tokens.reduce((acc: boolean, token) => {
            return acc && token.valid;
        }, true);
        activeCommand.set(command);
        commandHistory.update((history) => {
            history.push(command);
            return history;
        });
    }

    const unsubscribeCommandHistory = commandHistory.subscribe(async (history) => {
        if (historyList) {
            await tick();
            historyList.scrollTop = historyList.scrollHeight;
        }
    });

    onDestroy(unsubscribeCommandHistory);
</script>

<div class="flex flex-col flex-none h-56 bg-gray-800 text-white text-xl">
    <ol bind:this={historyList} class="flex-auto overflow-auto">
        {#each $commandHistory as entry}
            <CommandHistory entry={entry}/>
        {/each}
    </ol>
    <form on:submit={runCommand} class="flex flex-row flex-none border border-gray-500 rounded-lg mx-2 mb-2">
        <input bind:value={command} type="text" class="flex-auto px-2 py-2 bg-transparent rounded-lg focus:outline focus:outline-green-400 focus:outline-1"/>
        <button class="flex flex-row flex-none items-center px-4 border rounded-lg border-gray-500 hover:text-green-400 focus:text-green-400 hover:border-green-400 focus:border-green-400 transition-colors">
            <svg viewBox="0 0 24 24" class="w-6 h-6">
                <path fill="currentColor" d="M8,5.14V19.14L19,12.14L8,5.14Z" />
            </svg>
            <span class="block pl-2">Run</span>
        </button>
    </form>
</div>
