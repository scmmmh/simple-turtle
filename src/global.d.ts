/// <reference types="svelte" />

type Command = {
    success: boolean;
    action: string;
    params: (string | number)[];
    tokens: CommandToken[];
};

type CommandToken = {
    text: string;
    value: string | number;
    icon: string | null;
    valid: boolean;
};
