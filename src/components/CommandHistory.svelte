<script lang="ts">
    import { commandHistory, activeCommand } from '../store';

    export let entry: Command;

    function rerun(ev: Event) {
        ev.preventDefault();
        activeCommand.set(entry);
        commandHistory.update((history) => {
            history.push(entry);
            return history;
        });
    }
</script>

<li class="flex flex-row items-center pl-4 pr-2 py-2 border-b border-gray-600">
    {#if entry.success}
        <span class="sr-only">Success</span>
        <svg viewBox="0 0 24 24" class="flex-none w-6 h-6 text-green-400 mr-8" aria-hidden="true">
            <path fill="currentColor" d="M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M12 20C7.59 20 4 16.41 4 12S7.59 4 12 4 20 7.59 20 12 16.41 20 12 20M16.59 7.58L10 14.17L7.41 11.59L6 13L10 17L18 9L16.59 7.58Z" />
        </svg>
    {:else}
        <span class="sr-only">Failed</span>
        <svg viewBox="0 0 24 24" class="flex-none w-6 h-6 text-red-400 mr-8" aria-hidden="true">
            <path fill="currentColor" d="M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2C6.47,2 2,6.47 2,12C2,17.53 6.47,22 12,22C17.53,22 22,17.53 22,12C22,6.47 17.53,2 12,2M14.59,8L12,10.59L9.41,8L8,9.41L10.59,12L8,14.59L9.41,16L12,13.41L14.59,16L16,14.59L13.41,12L16,9.41L14.59,8Z" />
        </svg>
    {/if}
    <ol class="flex-auto flex flex-row space-x-3">
        {#each entry.tokens as token}
            <li class="flex flex-row items-center border {token.valid ? 'border-green-400' : 'border-red-400'} px-2 py-1 rounded-lg">
                {#if token.icon}
                    <svg viewBox="0 0 24 24" class="w-6 h-6 mr-2" aria-hidden="true">
                        {#if token.icon === 'turn'}
                            <path fill="currentColor" d="M14,4L16.29,6.29L13.41,9.17L14.83,10.59L17.71,7.71L20,10V4M10,4H4V10L6.29,7.71L11,12.41V20H13V11.59L7.71,6.29" />
                        {:else if token.icon === 'left'}
                            <path fill="currentColor" d="M20 13.5V20H18V13.5C18 11 16 9 13.5 9H7.83L10.91 12.09L9.5 13.5L4 8L9.5 2.5L10.92 3.91L7.83 7H13.5C17.09 7 20 9.91 20 13.5Z" />
                        {:else if token.icon === 'right'}
                            <path fill="currentColor" d="M20 8L14.5 13.5L13.09 12.09L16.17 9H10.5C8 9 6 11 6 13.5V20H4V13.5C4 9.91 6.91 7 10.5 7H16.17L13.08 3.91L14.5 2.5L20 8Z" />
                        {:else if token.icon === 'move'}
                            <path fill="currentColor" d="M14.12,10H19V8.2H15.38L13.38,4.87C13.08,4.37 12.54,4.03 11.92,4.03C11.74,4.03 11.58,4.06 11.42,4.11L6,5.8V11H7.8V7.33L9.91,6.67L6,22H7.8L10.67,13.89L13,17V22H14.8V15.59L12.31,11.05L13.04,8.18M14,3.8C15,3.8 15.8,3 15.8,2C15.8,1 15,0.2 14,0.2C13,0.2 12.2,1 12.2,2C12.2,3 13,3.8 14,3.8Z" />
                        {:else if token.icon === 'forward'}
                            <path fill="currentColor" d="M7.03 9.97H11.03V18.89L13.04 18.92V9.97H17.03L12.03 4.97Z" />
                        {:else if token.icon === 'backward'}
                            <path fill="currentColor" d="M7.03 13.92H11.03V5L13.04 4.97V13.92H17.03L12.03 18.92Z" />
                        {/if}
                    </svg>
                {/if}
                <span>{ token.text }</span>
            </li>
        {/each}
    </ol>
    {#if entry.success}
        <button on:click={rerun} class="flex-none px-3 py-2 text-white hover:text-green-400 focus:text-green-400" aria-hidden="true">
            <span class="sr-only">Re-run</span>
            <svg viewBox="0 0 24 24" class="flex-none w-6 h-6 mr-4" aria-hidden="true">
                <path fill="currentColor" d="M17.65,6.35C16.2,4.9 14.21,4 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20C15.73,20 18.84,17.45 19.73,14H17.65C16.83,16.33 14.61,18 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6C13.66,6 15.14,6.69 16.22,7.78L13,11H20V4L17.65,6.35Z" />
            </svg>
        </button>
    {/if}
</li>
