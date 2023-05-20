export type UserInfo = {
    id: string;
    username: string;
    discriminator: string;
    avatar: string;
    mfa_enabled?: boolean;
    banner?: string;
    accent_color?: number;
    locale?: string;
    flags?: number;
    premium_type?: number;
    public_flags?: number;
};

export type Guild = {
    id: string;
    name: string;
    icon?: string;
    permissions: string;
};

export enum PermissionFlags {
    CREATE_INSTANT_INVITE = 1 << 0,
    KICK_MEMBERS = 1 << 1,
    BAN_MEMBERS = 1 << 2,
    ADMINISTRATOR = 1 << 3,
    MANAGE_CHANNELS = 1 << 4,
    MANAGE_GUILD = 1 << 5,
    ADD_REACTIONS = 1 << 6,
    VIEW_AUDIT_LOG = 1 << 7,
    PRIORITY_SPEAKER = 1 << 8,
    STREAM = 1 << 9,
    VIEW_CHANNEL = 1 << 10,
    SEND_MESSAGES = 1 << 11,
    SEND_TTS_MESSAGES = 1 << 12,
    MANAGE_MESSAGES = 1 << 13,
    EMBED_LINKS = 1 << 14,
    ATTACH_FILES = 1 << 15,
    READ_MESSAGE_HISTORY = 1 << 16,
    MENTION_EVERYONE = 1 << 17,
    USE_EXTERNAL_EMOJIS = 1 << 18,
    VIEW_GUILD_INSIGHTS = 1 << 19,
    CONNECT = 1 << 20,
    SPEAK = 1 << 21,
    MUTE_MEMBERS = 1 << 22,
    DEAFEN_MEMBERS = 1 << 23,
    MOVE_MEMBERS = 1 << 24,
    USE_VAD = 1 << 25,
    CHANGE_NICKNAME = 1 << 26,
    MANAGE_NICKNAMES = 1 << 27,
    MANAGE_ROLES = 1 << 28,
    MANAGE_WEBHOOKS = 1 << 29,
    MANAGE_EMOJIS_AND_STICKERS = 1 << 30,
    USE_APPLICATION_COMMANDS = 1 << 31,
    REQUEST_TO_SPEAK = 1 << 32,
    MANAGE_EVENTS = 1 << 33,
    MANAGE_THREADS = 1 << 34,
    CREATE_PUBLIC_THREADS = 1 << 35,
    CREATE_PRIVATE_THREADS = 1 << 36,
    USE_EXTERNAL_STICKERS = 1 << 37,
    SEND_MESSAGES_IN_THREADS = 1 << 38,
    USE_EMBEDDED_ACTIVITIES = 1 << 39,
    MODERATE_MEMBERS = 1 << 40,
}

export enum ChannelTypes {
    GUILD_TEXT = 0,
    DM = 1,
    GUILD_VOICE = 2,
    GROUP_DM = 3,
    GUILD_CATEGORY = 4,
    GUILD_ANNOUNCEMENT = 5,
    ANNOUNCEMENT_THREAD = 10,
    PUBLIC_THREAD = 11,
    PRIVATE_THREAD = 12,
    GUILD_STAGE_VOICE = 13,
    GUILD_DIRECTORY = 14,
    GUILD_FORUM = 15,
}

export async function fetchUserInfo(accessToken: string) {
    const res = await fetch("https://discord.com/api/v9/users/@me", {
        method: "GET",
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
        next: {
            revalidate: 60,
        },
    });

    if (!res.ok) {
        throw new Error(await res.text());
    }

    return (await res.json()) as UserInfo;
}

export async function fetchGuilds(accessToken: string) {
    const res = await fetch("https://discord.com/api/v9/users/@me/guilds", {
        method: "GET",
        next: {
            revalidate: 10,
        },
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    if (!res.ok) {
        throw new Error(await res.text());
    }

    return (await res.json()) as Guild[];
}

export async function fetchGuildInfo(accessToken: string, id: string) {
    const res = await fetch(`"https://discord.com/api/v9/guilds/${id}"`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
        next: {
            revalidate: 30,
        },
    });

    if (!res.ok) {
        throw new Error(await res.text());
    }

    return (await res.json()) as Guild;
}

export function iconUrl(guild: Guild, size: number = 512) {
    return guild.icon != null
        ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}?size=${size}`
        : null;
}

export function avatarUrl(user: UserInfo, size: number = 512) {
    return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}?size=${size}`;
}

export function bannerUrl(
    id: string,
    banner: string,
    size: number = 1024
): string {
    return `https://cdn.discordapp.com/banners/${id}/${banner}?size=${size}`;
}
