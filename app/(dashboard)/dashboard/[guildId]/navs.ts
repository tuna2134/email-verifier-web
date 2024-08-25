"use client";

import { Settings } from "lucide-react";

export default async function getNavs(guildId: string) {
    return [
        {
            name: "基本的な設定",
            href: `/dashboard/${guildId}`,
            icon: Settings,
        },
    ];
}
