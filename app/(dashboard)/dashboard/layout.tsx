import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { ChevronDown } from "lucide-react";
import Link from "next/link";

export default function RootLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
        <ResizablePanelGroup direction="horizontal" className="min-h-screen">
            <ResizablePanel defaultSize={20} maxSize={25} className="bg-slate-200/20">
                <div className="p-8 h-16 flex items-center border-b">
                    <div className="flex justify-start items-center">
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
                <div>
                    <Button asChild variant="link">
                        <Link href="/" className="w-auto h-20 m-2">Hello</Link>
                    </Button>
                </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={80}>{children}</ResizablePanel>
        </ResizablePanelGroup>
    );
  }
  