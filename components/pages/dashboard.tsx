"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ChevronDown, House, LucideIcon } from "lucide-react";
import Link from "next/link";
import { getCookie, deleteCookie } from "cookies-next";
import { useUser } from "@/lib/user";

interface Nav {
    name: string;
    href: string;
    icon: LucideIcon;
}

interface DashboardLayoutProps {
    children: React.ReactNode;
    navs: Nav[];
}

export function DashboardLayout({ children, navs }: DashboardLayoutProps) {
    let token = getCookie("token");
    if (!token) {
        window.location.href = process.env
            .NEXT_PUBLIC_DISCORD_DASHBOARD_OAUTH_URL as string;
    }

    let { data, error, isLoading } = useUser(token as string);

    if (error) {
        window.location.href = process.env
            .NEXT_PUBLIC_DISCORD_DASHBOARD_OAUTH_URL as string;
        return <div>failed to load</div>;
    }
    if (isLoading) return <div>loading...</div>;

    console.log(data);

    function logout() {
        deleteCookie("token");
        window.location.href = "/";
    }

    return (
        <ResizablePanelGroup direction="horizontal" className="min-h-screen">
            <ResizablePanel defaultSize={25} maxSize={25}>
                <div className="flex h-16 items-center border-b p-8">
                    <div className="flex items-center justify-start">
                        <Avatar>
                            <AvatarFallback>{data?.username}</AvatarFallback>
                            <AvatarImage
                                src={`https://cdn.discordapp.com/avatars/${data?.id}/${data?.avatar}.png`}
                                alt={data?.username}
                            />
                        </Avatar>
                    </div>
                    <Popover>
                        <PopoverTrigger className="ml-auto">
                            <ChevronDown />
                        </PopoverTrigger>
                        <PopoverContent>
                            <Button onClick={logout} variant="destructive">
                                Logout
                            </Button>
                        </PopoverContent>
                    </Popover>
                </div>
                <div className="flex flex-col">
                    <Button asChild variant="ghost" size="lg">
                        <Link
                            href="/dashboard"
                            className="m-2 mb-8 justify-start font-bold"
                        >
                            <House className="mr-4" />
                            Home
                        </Link>
                    </Button>
                    <div className="border-b" />
                    {navs.map((nav, index) => (
                        <Button asChild variant="ghost" size="lg">
                            <Link
                                href={nav.href}
                                className="m-2 mb-8 justify-start font-bold"
                            >
                                <nav.icon className="mr-4" />
                                {nav.name}
                            </Link>
                        </Button>
                    ))}
                </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={80} className="bg-slate-400/10">
                <main className="mx-auto mt-8 max-w-4xl px-8">{children}</main>
            </ResizablePanel>
        </ResizablePanelGroup>
    );
}