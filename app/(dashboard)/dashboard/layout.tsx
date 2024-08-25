import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import { ChevronDown, House } from "lucide-react";
import Link from "next/link";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ResizablePanelGroup direction="horizontal" className="min-h-screen">
            <ResizablePanel defaultSize={20} maxSize={25}>
                <div className="flex h-16 items-center border-b p-8">
                    <div className="flex items-center justify-start">
                        <Avatar>
                            <AvatarFallback>test</AvatarFallback>
                        </Avatar>
                        <h3 className="ml-4">test user</h3>
                    </div>
                    <Popover>
                        <PopoverTrigger className="ml-auto">
                            <ChevronDown />
                        </PopoverTrigger>
                        <PopoverContent>
                            <p>logout</p>
                        </PopoverContent>
                    </Popover>
                </div>
                <div className="flex flex-col">
                    <Button asChild variant="ghost" size="lg">
                        <Link
                            href="/dashboard"
                            className="m-2 justify-start font-bold"
                        >
                            <House className="mr-4" />
                            Home
                        </Link>
                    </Button>
                </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={80} className="bg-slate-400/10">
                <main className="mx-auto mt-8 max-w-4xl px-8">{children}</main>
            </ResizablePanel>
        </ResizablePanelGroup>
    );
}
