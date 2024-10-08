"use client";
import { DashboardLayout } from "@/components/pages/dashboard";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useGuild } from "@/lib/api";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { getNavs } from "./navs";

export default function RootLayout({
    children,
    params,
}: Readonly<{
    children: React.ReactNode;
    params: {
        guildId: string;
    };
}>) {
    const token = getCookie("token");
    const navs = getNavs(params.guildId);
    const { data, error } = useGuild(token as string, params.guildId);
    const router = useRouter();
    if (error) {
        if (error.status === 404) {
            fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/invite_url`)
                .then((res) => res.json())
                .then((data) => {
                    router.push(data.url);
                });
        }
    }
    return (
        <DashboardLayout navs={navs}>
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/dashboard">Home</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>{data?.name}</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <div className="mt-4">{children}</div>
        </DashboardLayout>
    );
}
