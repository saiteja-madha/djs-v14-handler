import { ChatInputCommandInteraction, ApplicationCommandOptionData, Message } from "discord.js";

type PrefixCommandData = {
    enabled?: boolean;
    aliases?: string[];
    usage?: string;
    minArgsCount?: number;
};

type SlashCommandData = {
    enabled?: boolean;
    options?: ApplicationCommandOptionData[];
};

export interface SubCommandData {
    name: string;
    description: string;
    prefixData?: PrefixCommandData;
    slashData?: SlashCommandData;
    onPrefixCommand?: (message: Message, args: string[]) => any;
    onSlashCommand?: (interaction: ChatInputCommandInteraction) => any;
}

export default class SubCommand {
    name: string;
    description: string;
    prefixData: PrefixCommandData;
    slashData: SlashCommandData;
    onPrefixCommand: (message: Message, args: string[]) => any;
    onSlashCommand: (interaction: ChatInputCommandInteraction) => any;

    constructor(data: SubCommandData) {
        SubCommand.validate(data.name, data);
        this.name = data.name;
        this.description = data.description;
        this.prefixData = {
            enabled: data.prefixData?.enabled === undefined ? true : data.prefixData.enabled,
            aliases: data.prefixData?.aliases || [],
            usage: data.prefixData?.usage || "",
            minArgsCount: data.prefixData?.minArgsCount || 0,
        };
        this.slashData = {
            enabled: data.slashData?.enabled === undefined ? true : data.slashData.enabled,
            options: data.slashData?.options || [],
        };
        this.onPrefixCommand = data.onPrefixCommand || (() => {});
        this.onSlashCommand = data.onSlashCommand || (() => {});
    }

    get json() {
        return {
            name: this.name,
            description: this.description,
            type: 1,
            options: this.slashData.options,
        };
    }

    static validate(name: string, data: SubCommandData) {
        if (typeof data.description !== "string") {
            throw new TypeError(`SubCommand - description must be a string: ${name}`);
        }
        // validate prefixData
        if (data.prefixData && typeof data.prefixData !== "object") {
            throw new TypeError(`SubCommand - prefixData must be an object: ${name}`);
        }
        if (data.prefixData?.enabled && typeof data.prefixData.enabled !== "boolean") {
            throw new TypeError(`SubCommand - prefixData.enabled must be a boolean: ${name}`);
        }
        if (data.prefixData?.aliases && !Array.isArray(data.prefixData.aliases)) {
            throw new TypeError(`SubCommand - prefixData.aliases must be an array: ${name}`);
        }
        if (data.prefixData?.usage && typeof data.prefixData.usage !== "string") {
            throw new TypeError(`SubCommand - prefixData.usage must be a string: ${name}`);
        }
        if (data.prefixData?.minArgsCount && typeof data.prefixData.minArgsCount !== "number") {
            throw new TypeError(`SubCommand - prefixData.minArgsCount must be a number: ${name}`);
        }

        // validate slashData
        if (data.slashData && typeof data.slashData !== "object") {
            throw new TypeError(`SubCommand - slashData must be an object: ${name}`);
        }
        if (data.slashData?.enabled && typeof data.slashData.enabled !== "boolean") {
            throw new TypeError(`SubCommand - slashData.enabled must be a boolean: ${name}`);
        }
        if (data.slashData?.options && !Array.isArray(data.slashData.options)) {
            throw new TypeError(`SubCommand - slashData.options must be an array: ${name}`);
        }
        if (typeof data.slashData?.enabled === "undefined" || data.slashData.enabled) {
            if (typeof data.onSlashCommand !== "function") {
                throw new TypeError(`SubCommand - onSlashCommand must be a function: ${name}`);
            }
        }
    }
}