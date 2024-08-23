import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import Link from "next/link";

export default function Page({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined };
}) {
    let code = searchParams.code;
    if (!code) {
        return <div>Invalid code</div>;
    }
    return (
        <div className="h-screen">
            <div className="flex h-full w-full items-center justify-center">
                <Card>
                    <CardHeader>
                        <CardTitle>ログイン</CardTitle>
                        <CardDescription>
                            ログインすることでメールアドレスをチェックします。
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button asChild>
                            <Link
                                href={`${process.env.NEXT_PUBLIC_DISCORD_OAUTH_URL}&state=${code}`}
                            >
                                Login with Discord
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
