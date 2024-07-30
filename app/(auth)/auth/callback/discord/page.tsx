"use client";

import { useSearchParams } from "next/navigation";
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface User {
    username: string;
}

export default function Page() {
    const searchParams = useSearchParams();

    let state = searchParams.get("state");
    let code = searchParams.get("code");

    const [user, setUser] = React.useState<User | null>(null);

    React.useEffect(() => {
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
            <div className="flex w-full h-full items-center justify-center">
                <Card>
                    <CardHeader>
                        <CardTitle>認証確認画面</CardTitle>     
                        <CardDescription>あなたのメールアドレスが有効かどうか確認しています。</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p>{user ? `${user.username}さん、認証に成功しました。` : "認証中です"}</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}