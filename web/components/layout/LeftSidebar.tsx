"use client";

import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import PostTreeEditor from "./PostTreeEditor";

const LeftSidebar = () => {
  return (
    <div className="flex flex-col h-full bg-muted/80 border-r border-border">
      <Tabs defaultValue="explorer" className="flex flex-col h-full">
        <TabsList className="flex justify-start h-9 bg-muted/80 border-b border-border pl-1">
          <TabsTrigger
            value="explorer"
            className="h-9 px-2 data-[state=active]:bg-muted/80 data-[state=inactive]:bg-muted/50 data-[state=active]:border-t-2 data-[state=active]:border-t-primary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-file">
              <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
              <path d="M14 2v4a2 2 0 0 0 2 2h4" />
            </svg>
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value="explorer"
          className="flex-1 overflow-y-auto p-0 m-0">
          <PostTreeEditor />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LeftSidebar;
