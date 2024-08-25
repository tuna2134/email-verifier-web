"use client";
import { DashboardLayout } from "@/components/pages/dashboard";
import { Settings } from "lucide-react";

function getNavs(guildId: string) {
    return [
        {
            name: "基本的な設定",
            href: `/dashboard/${guildId}`,
            icon: Settings,
        },
    ];
}

export default function RootLayout({
    children,
    params,
}: Readonly<{
    children: React.ReactNode;
    params: {
        guildId: string;
    };
}>) {
    const navs = getNavs(params.guildId);
    return <DashboardLayout navs={navs}>{children}</DashboardLayout>;
}
