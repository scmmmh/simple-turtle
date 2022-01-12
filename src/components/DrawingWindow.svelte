<script lang="ts">
    import { onMount, onDestroy, tick } from 'svelte';

    import { commandHistory } from '../store';

    let canvasElement: HTMLCanvasElement;
    let ctx: CanvasRenderingContext2D;
    let turtleElement: SVGSVGElement;
    let canvasWidth = 400;
    let canvasHeight = 400;
    let animatedIdx = -1;

    async function sleep(duration) {
        return new Promise((resolve) => {
            setTimeout(resolve, duration);
        });
    }

    async function draw(commands: Command[]) {
        if (ctx) {
            ctx.clearRect(0, 0, canvasWidth, canvasHeight);
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 3;
            let x = Math.floor(canvasWidth / 2);
            let y = Math.floor(canvasHeight / 2);
            let direction = 0;
            turtleElement.style.left = x + 'px';
            turtleElement.style.top = y + 'px';
            turtleElement.style.transform = 'translate(-50%, -50%) rotate(0deg)';
            for (let idx = 0; idx < commands.length; idx++) {
                const command = commands[idx];
                if (command.success) {
                    if (command.action === 'move') {
                        let vec = [0 , 0];
                        const rad = direction * Math.PI / 180;
                        const dist = command.params.length === 2 ? (command.params[1] as number) * 10 : 50;
                        if (idx > animatedIdx) {
                            for (let count = 0; count < dist / 5; count++) {
                                vec = [0, count * 5];
                                vec = [
                                    Math.cos(rad) * vec[0] - Math.sin(rad) * vec[1],
                                    Math.sin(rad) * vec[0] + Math.cos(rad) * vec[1]
                                ];
                                ctx.beginPath();
                                ctx.moveTo(x, y);
                                ctx.lineTo(x + vec[0], y - vec[1]);
                                ctx.stroke();
                                turtleElement.style.left = (x + vec[0]) + 'px';
                                turtleElement.style.top = (y - vec[1]) + 'px';
                                await sleep(30);
                            }
                        }
                        if (command.params[0] === 'forward') {
                            vec = [0, dist];
                        }
                        vec = [
                            Math.cos(rad) * vec[0] - Math.sin(rad) * vec[1],
                            Math.sin(rad) * vec[0] + Math.cos(rad) * vec[1]
                        ];
                        ctx.beginPath();
                        ctx.moveTo(x, y);
                        x = x + vec[0];
                        y = y - vec[1];
                        ctx.lineTo(x, y);
                        ctx.stroke();
                    } else if (command.action === 'turn') {
                        const angle = (command.params.length === 2) ? command.params[1] as number : 90;
                        let tmpDirection = direction;
                        if (idx > animatedIdx) {
                            for (let count = 0; count < (angle / 5); count++) {
                                if (command.params[0] === 'left') {
                                    tmpDirection = (tmpDirection + 5) % 360;
                                } else {
                                    tmpDirection = (tmpDirection - 5) % 360;
                                }
                                turtleElement.style.transform = 'translate(-50%, -50%) rotate(' + (-tmpDirection) + 'deg)';
                                await sleep(30);
                            }
                        }
                        if (command.params[0] === 'left') {
                            direction = (direction + angle) % 360;
                        } else {
                            direction = (direction - angle) % 360;
                        }
                    }
                    animatedIdx = Math.max(animatedIdx, idx);
                    turtleElement.style.left = x + 'px';
                    turtleElement.style.top = y + 'px';
                    turtleElement.style.transform = 'translate(-50%, -50%) rotate(' + ((-direction) % 360) + 'deg)';
                }
            }
        }
    }

    function resize() {
        if (canvasElement) {
            canvasHeight = canvasElement.parentElement.clientHeight;
            canvasWidth = canvasElement.parentElement.clientWidth;
            tick().then(() => {
                draw($commandHistory);
            })
        }
    }

    const commandHistoryUnsubscribe = commandHistory.subscribe((commands) => {
        draw(commands);
    });

    onMount(() => {
        if (canvasElement) {
            ctx = canvasElement.getContext('2d');
        }
        window.addEventListener('resize', resize);
        resize();
    });

    onDestroy(() => {
        window.removeEventListener('resize', resize);
        commandHistoryUnsubscribe();
    });
</script>

<div class="flex-auto bg-black overflow-hidden relative">
    <canvas bind:this={canvasElement} width={canvasWidth} height={canvasHeight}></canvas>
    <svg bind:this={turtleElement} viewBox="0 0 24 24" class="w-8 h-8 absolute text-yellow-500">
        <path fill="currentColor" d="M8.47,5.95C8.95,5.67 9.47,5.44 10,5.28V4C10,2.9 10.87,2 11.97,1.97C13.13,2 14,2.9 14,4V5.28C14.53,5.45 15.05,5.67 15.53,5.95L13.93,8.07H10.07L8.47,5.95M19,12C19,12.5 18.95,12.95 18.86,13.4L16.33,12.62L15.14,8.96L16.74,6.85C17.17,7.25 17.55,7.7 17.88,8.2C18.67,8.13 19.43,8.25 20.11,8.59C21.14,9.12 21.84,10.13 22,11.28L19,11.64C19,11.76 19,11.88 19,12M5,12C5,11.88 5,11.76 5,11.65L2,11.28C2.16,10.13 2.86,9.12 3.89,8.59C4.57,8.25 5.34,8.13 6.08,8.26C6.41,7.75 6.79,7.28 7.24,6.87L8.86,8.95L7.67,12.62L5.14,13.4C5.05,12.95 5,12.5 5,12M10.24,9.57H13.76L14.85,12.93L12,15L9.15,12.93L10.24,9.57M8.13,14.05L11.25,16.31V18.96C10.68,18.9 10.13,18.77 9.62,18.58L8.39,21.34C7.33,20.87 6.57,19.9 6.37,18.76C6.23,18 6.35,17.24 6.69,16.56C6.24,16.04 5.87,15.46 5.59,14.82L8.13,14.05M15.87,14.05L18.41,14.82C18.13,15.46 17.76,16.04 17.31,16.56C17.65,17.24 17.77,18 17.64,18.76C17.43,19.9 16.67,20.87 15.61,21.34L14.39,18.58C13.86,18.77 13.33,18.94 12.75,19V16.31L15.87,14.05Z" />
    </svg>
</div>
