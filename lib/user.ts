import useSWR from "swr";

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

async function fetchWithToken<T>(url: string, token: string): Promise<T> {
    let response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    const user: T = await response.json();
    console.log(user);
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
