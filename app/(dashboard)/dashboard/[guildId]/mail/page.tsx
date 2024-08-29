"use client";

import { DataTable } from "@/components/pages/data-table";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { GuildMail, useGuildMails } from "@/lib/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { ColumnDef } from "@tanstack/react-table";
import { getCookie } from "cookies-next";
import { EllipsisVertical, PlusIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import z from "zod";

const columns: ColumnDef<GuildMail>[] = [
    {
        accessorKey: "id",
        header: "ID",
    },
    {
        accessorKey: "mail",
        header: "メールアドレス",
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            async function handleDelete() {
                const id = row.getValue("id");
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/dashboard/guilds/${row.original.guild_id}/mails/${id}`,
                    {
                        method: "DELETE",
                        headers: {
                            Authorization: `Bearer ${getCookie("token")}`,
                        },
                    },
                );
                if (res.ok) {
                    toast({
                        title: "Success",
                        description: "メールアドレスを削除しました。",
                    });
                }
            }

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <EllipsisVertical />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem>
                            <button
                                className="text-red-500"
                                onClick={handleDelete}
                            >
                                Delete
                            </button>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];

const formSchema = z.object({
    mail: z.string().email(),
});

export default function Page({
    params,
}: {
    params: {
        guildId: string;
    };
}) {
    const token = getCookie("token") as string;

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    });

    const { data, error, isLoading } = useGuildMails(token, params.guildId);

    if (error) {
        return <div>Error</div>;
    }

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!data) {
        return <div>No data</div>;
    }

    async function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values);
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_ENDPOINT}/dashboard/guilds/${params.guildId}/mails`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    mail: values.mail,
                }),
            },
        );
        if (res.ok) {
            toast({
                title: "Success",
                description: "メールアドレスを追加しました。",
            });
        }
    }

    return (
        <>
            <h2 className="text-2xl font-bold">メアドの限定リスト</h2>
            <p className="mt-3 text-sm text-slate-950/45">
                対象のメアドを絞ることができます。
            </p>
            <div className="mt-8">
                <Dialog>
                    <DialogTrigger asChild>
                        <Button>
                            <PlusIcon className="mr-2" />
                            追加
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>メールアドレスの追加</DialogTitle>
                            <DialogDescription>
                                メールアドレスを追加します。
                            </DialogDescription>
                        </DialogHeader>
                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className="space-y-8"
                            >
                                <FormField
                                    control={form.control}
                                    name="mail"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                メールアドレス
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="対象のメールアドレス"
                                                    {...field}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit">
                                    <PlusIcon className="mr-2" />
                                    追加
                                </Button>
                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>
            </div>
            <div className="mt-8 rounded-md border">
                <DataTable columns={columns} data={data} />
            </div>
        </>
    );
}
