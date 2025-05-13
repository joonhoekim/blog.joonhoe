"use client";

import { useState, type FC } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SidebarIcon,
  PanelRightCloseIcon,
  PanelLeftCloseIcon,
  TerminalIcon,
  MessageSquareIcon,
  LayoutPanelTopIcon,
  MoonIcon,
  SunIcon,
  PencilIcon,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useVSCodeLayout } from "./VSCodeLayoutContext";
import { useTheme } from "next-themes";

const BlogCategories = [
  { name: "All", path: "/" },
  { name: "Technology", path: "/technology" },
  { name: "Programming", path: "/programming" },
  { name: "Web Development", path: "/web-development" },
  { name: "AI", path: "/ai" },
  { name: "Projects", path: "/projects" },
];

const Header: FC = () => {
  const pathname = usePathname();
  const [activeMenus, setActiveMenus] = useState<string[]>([]);
  const { theme, setTheme } = useTheme();

  const {
    showBottomSidebar,
    activeBottomTab,
    isEditMode,
    toggleLeftSidebar,
    toggleRightSidebar,
    toggleBottomSidebar,
    toggleBottomTabWithPanel,
    toggleEditMode,
  } = useVSCodeLayout();

  const toggleMenu = (menu: string) => {
    if (activeMenus.includes(menu)) {
      setActiveMenus(activeMenus.filter((m) => m !== menu));
    } else {
      setActiveMenus([...activeMenus, menu]);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <header className="flex flex-col bg-muted/60 dark:bg-muted/80 border-b border-border text-sm">
      <div className="h-10 flex items-center px-4">
        <div className="flex items-center space-x-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={isEditMode ? "default" : "ghost"}
                  size="sm"
                  className={`h-7 px-2 py-1 flex items-center space-x-1 ${
                    isEditMode
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-accent"
                  }`}
                  onClick={toggleEditMode}
                  aria-label="Toggle edit mode">
                  <PencilIcon className="h-4 w-4" />
                  <span>Edit Mode</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Toggle Edit Mode</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="flex-1 flex justify-center">
          <div className="text-sm text-muted-foreground">blog.joonhoe.com</div>
        </div>

        <div className="flex items-center space-x-1">
          <TooltipProvider>
            {/* Theme Toggle Button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 hover:bg-accent"
                  onClick={toggleTheme}
                  aria-label="Toggle theme">
                  {theme === "dark" ? (
                    <SunIcon className="h-4 w-4" />
                  ) : (
                    <MoonIcon className="h-4 w-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Toggle Theme</p>
              </TooltipContent>
            </Tooltip>

            {/* Left Sidebar Toggle */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 hover:bg-accent"
                  onClick={toggleLeftSidebar}
                  aria-label="Toggle left sidebar">
                  <PanelLeftCloseIcon className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Toggle Explorer</p>
              </TooltipContent>
            </Tooltip>

            {/* Bottom Panel Buttons */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`h-7 w-7 p-0 hover:bg-accent ${showBottomSidebar && activeBottomTab === "comments" ? "text-primary" : ""}`}
                  onClick={() => toggleBottomTabWithPanel("comments")}
                  aria-label="Toggle comments panel">
                  <MessageSquareIcon className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Comments</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`h-7 w-7 p-0 hover:bg-accent ${showBottomSidebar && activeBottomTab === "terminal" ? "text-primary" : ""}`}
                  onClick={() => toggleBottomTabWithPanel("terminal")}
                  aria-label="Toggle terminal panel">
                  <TerminalIcon className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Terminal</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`h-7 w-7 p-0 hover:bg-accent ${showBottomSidebar ? "text-primary" : ""}`}
                  onClick={toggleBottomSidebar}
                  aria-label="Toggle bottom panel">
                  <LayoutPanelTopIcon className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Toggle Panel</p>
              </TooltipContent>
            </Tooltip>

            {/* Right Sidebar Toggle */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 hover:bg-accent"
                  onClick={toggleRightSidebar}
                  aria-label="Toggle right sidebar">
                  <PanelRightCloseIcon className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Toggle Outline</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* VSCode-style tabs for blog categories */}
      <div
        className="flex items-center overflow-x-auto bg-muted dark:bg-muted/60"
        role="tablist">
        {BlogCategories.map((category) => {
          const isActive =
            pathname === category.path ||
            (category.path !== "/" && pathname?.startsWith(category.path));

          return (
            <Link key={category.path} href={category.path} tabIndex={0}>
              <div
                className={`
									flex items-center h-9 px-3 border-r border-border 
									${isActive ? "bg-background text-foreground" : "bg-muted/70 text-muted-foreground hover:text-foreground"}
									cursor-pointer transition-colors
								`}
                role="tab"
                aria-selected={isActive}
                tabIndex={-1}>
                <span className="whitespace-nowrap">{category.name}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </header>
  );
};

export default Header;
