"use client";
import { DashboardLayout } from "@/components/pages/dashboard";
import { useUserGuilds } from "@/lib/api";
import { getCookie } from "cookies-next";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
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
        <Link href={`/dashboard/${guild.id}`} className="rounded-md border p-4">
            <div>
                <Avatar key={index} className="h-auto w-auto">
                    <AvatarImage
                        src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png?size=1024`}
                    />
                    <AvatarFallback>{guild.name}</AvatarFallback>
                </Avatar>
                <p className="mt-2 text-center">{guild.name}</p>
            </div>
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
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/dashboard">Home</BreadcrumbLink>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <h1 className="mb-8 mt-4 text-2xl font-semibold">Dashboard</h1>
            <div className="grid grid-cols-4 gap-6">
                <Suspense fallback={<Skeleton className="h-32 w-32" />}>
                    <GuildList token={token as string} />
                </Suspense>
            </div>
        </DashboardLayout>
    );
}
