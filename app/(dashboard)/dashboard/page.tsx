"use client";
import { DashboardLayout } from "@/components/pages/dashboard";
import { useUserGuilds } from "@/lib/api";
import { getCookie } from "cookies-next";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";

function GuildList({ token }: { token: string }) {
    const { data } = useUserGuilds(token as string);

    console.log(data);

    let guilds = data?.filter(
        (guild) => guild.permissions === "114349209288703",
    );

    return guilds?.map((guild, index) => (
        <Link href={`/dashboard/${guild.id}`}>
            <Avatar key={index} className="h-full w-full">
                <AvatarImage
                    src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png?size=1024`}
                />
                <AvatarFallback>{guild.name}</AvatarFallback>
            </Avatar>
        </Link>
    ));
}

export default function Page() {
    let token = getCookie("token");
    const router = useRouter();
    if (!token) {
        router.push(
            process.env.NEXT_PUBLIC_DISCORD_DASHBOARD_OAUTH_URL as string,
        );
    }

    return (
        <DashboardLayout navs={[]}>
            <h1 className="mb-8 text-2xl font-semibold">Dashboard</h1>
            <div className="grid grid-cols-4 gap-6">
                <Suspense fallback={<Skeleton className="h-32 w-32" />}>
                    <GuildList token={token as string} />
                </Suspense>
            </div>
        </DashboardLayout>
    );
}
