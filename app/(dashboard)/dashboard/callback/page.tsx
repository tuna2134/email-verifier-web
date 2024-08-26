"use client";
import { useEffect } from "react";
import { setCookie } from "cookies-next";
import { useRouter } from "next/navigation";

export default function Page() {
    let router = useRouter();
    useEffect(() => {
        let code = new URLSearchParams(window.location.search).get("code");
        if (code) {
            fetch(
                `${process.env.NEXT_PUBLIC_API_ENDPOINT}/dashboard/exchange_token`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ code, state: "" }),
                },
            )
                .then((res) => {
                    console.log(res);
                    return res.json();
                })
                .then((data) => {
                    setCookie("token", data.token);
                    router.push("/dashboard");
                });
        }
    });
    return (
        <div>
            <h1>Redirecting...</h1>
        </div>
    );
}
