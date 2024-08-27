import useSWR from "swr";

class FetchError extends Error {
    info?: string;
    status?: number;
}

export interface User {
    id: string;
    username: string;
    discriminator: string;
    avatar: string | null;
}

export interface Guild {
    id: string;
    name: string;
    icon: string;
    owner: boolean;
}

export interface Role {
    id: string;
    name: string;
}

export interface Channel {
    id: string;
    name: string;
}

export interface GeneralSettings {
    email_pattern: string;
    role_id: string;
    channel_id: string;
}

async function fetchWithToken<T>(url: string, token: string): Promise<T> {
    let response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (!response.ok) {
        let error = new FetchError(response.status.toString());
        error.info = await response.json();
        error.status = response.status;
        throw error;
    }
    const user: T = await response.json();
    return user;
}

export function useUser(token: string) {
    const result = useSWR(
        [
            `${process.env.NEXT_PUBLIC_API_ENDPOINT}/dashboard/users/@me`,
            token as string,
        ],
        ([url, token]) => fetchWithToken<User>(url, token),
    );
    return result;
}

export function useUserGuilds(token: string) {
    const result = useSWR(
        [
            `${process.env.NEXT_PUBLIC_API_ENDPOINT}/dashboard/users/@me/guilds`,
            token as string,
        ],
        ([url, token]) => fetchWithToken<Guild[]>(url, token),
    );
    return result;
}

export function useGuildRoles(token: string, guildId: string) {
    const result = useSWR(
        [
            `${process.env.NEXT_PUBLIC_API_ENDPOINT}/dashboard/guilds/${guildId}/roles`,
            token as string,
        ],
        ([url, token]) => fetchWithToken<Role[]>(url, token),
    );
    return result;
}

export function useGuildChannels(token: string, guildId: string) {
    const result = useSWR(
        [
            `${process.env.NEXT_PUBLIC_API_ENDPOINT}/dashboard/guilds/${guildId}/channels`,
            token as string,
        ],
        ([url, token]) => fetchWithToken<Channel[]>(url, token),
    );
    return result;
}

export interface Getguild {
    Ok: Guild;
}

export function useGuild(token: string, guildId: string) {
    const result = useSWR(
        [
            `${process.env.NEXT_PUBLIC_API_ENDPOINT}/dashboard/guilds/${guildId}`,
            token as string,
        ],
        ([url, token]) => fetchWithToken<Getguild>(url, token),
    );
    return result;
}

export function useGuildGeneralSettings(token: string, guildId: string) {
    const result = useSWR(
        [
            `${process.env.NEXT_PUBLIC_API_ENDPOINT}/dashboard/guilds/${guildId}/general_settings`,
            token as string,
        ],
        ([url, token]) => fetchWithToken<any>(url, token),
    );
    return result;
}
