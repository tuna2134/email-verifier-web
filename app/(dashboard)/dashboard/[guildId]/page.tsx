"use client";

import {
    Form,
    FormControl,
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
import { DashboardLayout } from "@/components/pages/dashboard";

const formSchema = z.object({
    email_pattern: z.string(),
    role: z.string(),
});

export default function Page() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    });

    async function onSubmit(data: z.infer<typeof formSchema>) {
        console.log(data);
    }
    return (
        <DashboardLayout navs={[]}>
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
                                <Select onValueChange={field.onChange}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="ロール"></SelectValue>
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="test">
                                            test
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </FormItem>
                        )}
                    />
                    <Button type="submit">保存</Button>
                </form>
            </Form>
        </DashboardLayout>
    );
}
