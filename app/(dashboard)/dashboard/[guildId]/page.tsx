"use client";

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectTrigger,
    SelectValue,
    SelectItem,
} from "@/components/ui/select";
import {
    useGuildChannels,
    useGuildGeneralSettings,
    useGuildRoles,
} from "@/lib/api";
import { getCookie } from "cookies-next";
import React, { Suspense } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Switch } from "@/components/ui/switch";

function SelectRoleContent({
    token,
    guildId,
}: {
    token: string;
    guildId: string;
}) {
    let { data } = useGuildRoles(token as string, guildId);
    return (
        <SelectContent>
            {data?.map((role, index) => (
                <SelectItem key={index} value={role.id}>
                    {role.name}
                </SelectItem>
            ))}
        </SelectContent>
    );
}

function SelectChannelContent({
    token,
    guildId,
}: {
    token: string;
    guildId: string;
}) {
    let { data } = useGuildChannels(token, guildId);
    return (
        <SelectContent>
            {data?.map((channel, index) => (
                <SelectItem key={index} value={channel.id}>
                    {channel.name}
                </SelectItem>
            ))}
        </SelectContent>
    );
}

export default function Page({ params }: { params: { guildId: string } }) {
    let token = getCookie("token") as string;
    const { toast } = useToast();

    const formSchema = z.object({
        email_pattern: z.string(),
        role: z.string(),
        channelId: z.string(),
        enable_check_mail: z.boolean(),
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email_pattern: "",
            role: "",
            channelId: "",
            enable_check_mail: false,
        },
    });

    const { data, isLoading } = useGuildGeneralSettings(token, params.guildId);

    React.useEffect(() => {
        if (data && !isLoading) {
            form.reset({
                email_pattern: data.email_pattern,
                role: data.role_id,
                channelId: data.channel_id,
                enable_check_mail: data.enable_check_mail,
            });
        }
    }, [data, isLoading]);

    async function onSubmit(data: z.infer<typeof formSchema>) {
        await fetch(
            `${process.env.NEXT_PUBLIC_API_ENDPOINT}/dashboard/guilds/${params.guildId}/general_settings`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    email_pattern: data.email_pattern,
                    role_id: data.role,
                    channel_id: data.channelId,
                    enable_check_mail: data.enable_check_mail,
                }),
            },
        );
        toast({
            title: "Success",
            description: "設定を保存しました",
        });
    }

    return (
        <>
            <h1 className="text-2xl font-bold">基本的な設定</h1>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="mt-8 space-y-8"
                >
                    <FormField
                        control={form.control}
                        name="email_pattern"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>メールアドレスのパターン</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="正規表現で書いてください"
                                        {...field}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="role"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    認証成功した際に渡すロール
                                </FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    value={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="ロール"></SelectValue>
                                        </SelectTrigger>
                                    </FormControl>
                                    <Suspense fallback={<div>Loading...</div>}>
                                        <SelectRoleContent
                                            token={token as string}
                                            guildId={params.guildId}
                                        />
                                    </Suspense>
                                </Select>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="enable_check_mail"
                        render={({ field }) => (
                            <FormItem className="flex items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                    <FormLabel>
                                        メールアドレスのチェックを有効にする
                                    </FormLabel>
                                    <FormDescription>
                                        認証時にメアドがリストにあるか確認します。
                                    </FormDescription>
                                </div>
                                <FormControl>
                                    <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="channelId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>認証パネルの送信先</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    value={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="チャンネル"></SelectValue>
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectChannelContent
                                        token={token}
                                        guildId={params.guildId}
                                    />
                                </Select>
                            </FormItem>
                        )}
                    />
                    <Button type="submit">保存</Button>
                </form>
            </Form>
        </>
    );
}
