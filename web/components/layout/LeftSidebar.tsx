"use client";

import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import TreeEditor from "./TreeEditor";

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

          <TabsTrigger
            value="search"
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
              className="lucide lucide-search">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </TabsTrigger>

          <TabsTrigger
            value="git"
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
              className="lucide lucide-git-branch">
              <line x1="6" x2="6" y1="3" y2="15" />
              <circle cx="18" cy="6" r="3" />
              <circle cx="6" cy="18" r="3" />
              <path d="M18 9a9 9 0 0 1-9 9" />
            </svg>
          </TabsTrigger>

          <TabsTrigger
            value="extensions"
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
              className="lucide lucide-puzzle">
              <path d="M19.439 7.85c-.049.322.059.648.289.878l1.568 1.568c.47.47.706 1.087.706 1.704s-.235 1.233-.706 1.704l-1.611 1.611a.98.98 0 0 1-.837.276c-.47-.07-.802-.48-.743-.95l.067-.551c.073-.595-.11-1.17-.51-1.57l-1.957-1.957c-.37-.37-.865-.575-1.386-.575h-2.586c-.71 0-1.39-.282-1.89-.783L4.045 4.457a1 1 0 0 0-1.414 0L1.121 5.97a1 1 0 0 0 0 1.414l7.758 7.758c.501.501.783 1.181.783 1.89v2.586c0 .521.205 1.017.574 1.386l1.957 1.957c.4.4.975.583 1.57.51l.55-.067c.471-.059.882.273.951.743a.979.979 0 0 1-.276.837l-1.61 1.61a2.404 2.404 0 0 1-1.705.707 2.402 2.402 0 0 1-1.704-.706l-1.568-1.568a1.026 1.026 0 0 0-.877-.29c-.331.05-.607.26-.733.548l-1.38 3.156c-.18.418-.106.906.199 1.249.306.344.79.464 1.217.314l7.084-2.428c1.409-.495 2.588-1.48 3.325-2.772l3.35-5.798" />
            </svg>
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value="explorer"
          className="flex-1 overflow-y-auto p-0 m-0">
          <div className="p-3 text-sm font-medium">EXPLORER</div>
          <TreeEditor />
        </TabsContent>

        <TabsContent value="search" className="flex-1 overflow-y-auto p-0 m-0">
          <div className="p-3 text-sm font-medium">SEARCH</div>
          <div className="px-4 py-2">
            <input
              type="text"
              placeholder="Search in files"
              className="w-full bg-input text-sm text-foreground border border-input rounded px-2 py-1"
            />
          </div>
        </TabsContent>

        <TabsContent value="git" className="flex-1 overflow-y-auto p-0 m-0">
          <div className="p-3 text-sm font-medium">SOURCE CONTROL</div>
          <div className="px-4 py-2">
            <div className="text-sm text-muted-foreground">
              No changes detected
            </div>
          </div>
        </TabsContent>

        <TabsContent
          value="extensions"
          className="flex-1 overflow-y-auto p-0 m-0">
          <div className="p-3 text-sm font-medium">EXTENSIONS</div>
          <div className="px-4 py-2">
            <input
              type="text"
              placeholder="Search extensions"
              className="w-full bg-input text-sm text-foreground border border-input rounded px-2 py-1"
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LeftSidebar;
