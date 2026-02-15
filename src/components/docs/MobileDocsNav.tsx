"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import { DocsSidebarNav } from "./DocsSidebarNav";

interface MobileDocsNavProps {
    groups: { title: string; items: { title: string; href: string }[] }[];
}

export function MobileDocsNav({ groups }: MobileDocsNavProps) {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden">
                    <Menu className="mr-2 h-6 w-6" />
                    <span className="font-bold">Menu</span>
                </Button>
            </DialogTrigger>
            {/* 
        Using Dialog as a mobile drawer. 
      */}
            <DialogContent className="fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500 inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm overflow-y-auto">
                <DialogTitle className="sr-only">Navigation Menu</DialogTitle>
                <div className="px-1">
                    <DocsSidebarNav groups={groups} />
                </div>
            </DialogContent>
        </Dialog>
    );
}
