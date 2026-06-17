import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DesignPanel } from "./properties/design-panel";

import { Box, File, Palette } from "lucide-react";
import { AssetsPanel } from "./assets-panel";
import { PagesPanel } from "./pages-panel";

export function PropertiesPanel() {
    return (
        <div className="h-full flex flex-col bg-card border-l border-border">
            <Tabs defaultValue="design" className="flex flex-col h-full w-full">
                <div className="px-3 py-2 border-b border-border/50">
                    <TabsList className="w-full grid grid-cols-3 h-8 bg-muted/50 p-0.5 gap-0.5">
                        <TabsTrigger value="design" className="text-[10px] h-7 data-[state=active]:bg-background data-[state=active]:shadow-sm cursor-pointer">
                            <Palette className="w-3.5 h-3.5 mr-1.5" />
                            Design
                        </TabsTrigger>

                        <TabsTrigger value="assets" className="text-[10px] h-7 data-[state=active]:bg-background data-[state=active]:shadow-sm cursor-pointer">
                            <Box className="w-3.5 h-3.5 mr-1.5" />
                            Assets
                        </TabsTrigger>
                        <TabsTrigger value="pages" className="text-[10px] h-7 data-[state=active]:bg-background data-[state=active]:shadow-sm cursor-pointer">
                            <File className="w-3.5 h-3.5 mr-1.5" />
                            Pages
                        </TabsTrigger>
                    </TabsList>
                </div>

                <div className="flex-1 overflow-hidden relative">
                    <TabsContent value="design" className="h-full m-0 data-[state=active]:flex flex-col">
                        <DesignPanel />
                    </TabsContent>

                    <TabsContent value="assets" className="h-full m-0 data-[state=active]:flex flex-col">
                        <AssetsPanel />
                    </TabsContent>
                    <TabsContent value="pages" className="h-full m-0 data-[state=active]:flex flex-col">
                        <PagesPanel />
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    );
}
