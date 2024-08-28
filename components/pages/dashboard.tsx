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
import { ChevronDown, House, LucideIcon, TableOfContents } from "lucide-react";
import Link from "next/link";
import { getCookie, deleteCookie } from "cookies-next";
import { useUser } from "@/lib/api";
import { useRouter } from "next/navigation";
import { Suspense } from "react";
import { Skeleton } from "../ui/skeleton";
import { useMediaQuery } from "@/components/hooks/use-media-query";
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from "../ui/sheet";

interface Nav {
    name: string;
    href: string;
    icon: LucideIcon;
}

interface DashboardLayoutProps {
    children: React.ReactNode;
    navs: Nav[];
}

function User({ token }: { token: string }) {
    let router = useRouter();
    let { data } = useUser(token);

    function logout() {
        deleteCookie("token");
        router.push("/");
    }

    return (
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
    );
}

interface ResponsiveDashboardLayoutProps extends DashboardLayoutProps {
    token: string;
}

function DesktopDashboardLayout({
    children,
    navs,
    token,
}: ResponsiveDashboardLayoutProps) {
    return (
        <ResizablePanelGroup direction="horizontal" className="min-h-screen">
            <ResizablePanel defaultSize={25} maxSize={25}>
                <Suspense fallback={<Skeleton className="h-16" />}>
                    <User token={token as string} />
                </Suspense>
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
                    {navs.length !== 0 && <div className="border-b" />}
                    {navs.map((nav, index) => (
                        <Button asChild variant="ghost" size="lg" key={index}>
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

function MobileDashboardLayout({
    children,
    navs,
    token,
}: ResponsiveDashboardLayoutProps) {
    return (
        <Sheet>
            <div className="flex h-16 items-center border-b p-8">
                <SheetTrigger>
                    <TableOfContents />
                </SheetTrigger>
                <SheetContent side="left">
                    <SheetHeader>
                        <Suspense fallback={<Skeleton className="h-16" />}>
                            <User token={token as string} />
                        </Suspense>
                    </SheetHeader>
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
                        {navs.length !== 0 && <div className="border-b" />}
                        {navs.map((nav, index) => (
                            <Button
                                asChild
                                variant="ghost"
                                size="lg"
                                key={index}
                            >
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
                </SheetContent>
            </div>
            <div className="p-4">{children}</div>
        </Sheet>
    );
}

export function DashboardLayout({ children, navs }: DashboardLayoutProps) {
    let router = useRouter();

    let token = getCookie("token");

    if (!token) {
        router.push(
            process.env.NEXT_PUBLIC_DISCORD_DASHBOARD_OAUTH_URL as string,
        );
    }

    const isDesktop = useMediaQuery("(min-width: 768px)");

    const Component = isDesktop ? DesktopDashboardLayout : MobileDashboardLayout;

    return <Component children={children} navs={navs} token={token as string} />;
}
