"use client";
import { DashboardLayout } from "@/components/pages/dashboard";
import { useUserGuilds } from "@/lib/user";
import { getCookie } from "cookies-next";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";

export default function Page() {
    let token = getCookie("token");
    if (!token) {
        window.location.href = process.env
            .NEXT_PUBLIC_DISCORD_DASHBOARD_OAUTH_URL as string;
    }

    const { data, error, isLoading } = useUserGuilds(token as string);
    if (isLoading) return <div>loading...</div>;
    if (error) {
        window.location.href = process.env
            .NEXT_PUBLIC_DISCORD_DASHBOARD_OAUTH_URL as string;
    }
    let guilds = data?.filter((guild) => guild.owner);
    console.log(guilds)

    return (
        <DashboardLayout navs={[]}>
            <h1 className="text-2xl font-semibold mb-8">Dashboard</h1>
            <div className="grid grid-cols-4 gap-6">
                {guilds?.map((guild, index) => (
                    <Link href={`/dashboard/${guild.id}`}>
                        <Avatar key={index} className="h-full w-full">
                            <AvatarImage
                                src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`}
                            />
                            <AvatarFallback>{guild.name}</AvatarFallback>
                        </Avatar>
                    </Link>
                ))}
            </div>
        </DashboardLayout>
    );
}
