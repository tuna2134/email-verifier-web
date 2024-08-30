"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";

interface User {
    username: string;
}

function Content() {
    const searchParams = useSearchParams();

    let state = searchParams.get("state");
    let code = searchParams.get("code");

    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        if (!state || !code) {
            return;
        }

        fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/auth/verify/discord`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                code,
                state,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.status === 200) {
                    setUser(data.user);
                } else {
                    toast({
                        title: "エラー",
                        description: data.message,
                        variant: "destructive",
                    });
                }
            });
    }, [setUser, state, code]);

    if (!state) {
        return <div>Invalid state</div>;
    }

    if (!code) {
        return <div>Invalid code</div>;
    }

    return (
        <div className="h-screen">
            <div className="flex h-full w-full items-center justify-center">
                <Card>
                    <CardHeader>
                        <CardTitle>認証確認画面</CardTitle>
                        <CardDescription>
                            あなたのメールアドレスが有効かどうか確認しています。
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p>
                            {user
                                ? `${user.username}さん、認証に成功しました。`
                                : "認証中です"}
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default function Page() {
    return (
        <Suspense>
            <Content />
        </Suspense>
    );
}
