"use client";

import { Mail, Settings } from "lucide-react";

export function getNavs(guildId: string) {
    return [
        {
            name: "基本的な設定",
            href: `/dashboard/${guildId}`,
            icon: Settings,
        },
        {
            name: "メールアドレスの追加",
            href: `/dashboard/${guildId}/mail`,
            icon: Mail,
        },
    ];
}
