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
} from "lucide-react";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { useVSCodeLayout } from "./VSCodeLayoutContext";

const BlogCategories = [
	{ name: "All", path: "/" },
	{ name: "Technology", path: "/category/technology" },
	{ name: "Programming", path: "/category/programming" },
	{ name: "Web Development", path: "/category/web-development" },
	{ name: "AI", path: "/category/ai" },
	{ name: "Projects", path: "/category/projects" },
];

const Header: FC = () => {
	const pathname = usePathname();
	const [activeMenus, setActiveMenus] = useState<string[]>([]);

	const {
		showBottomSidebar,
		activeBottomTab,
		toggleLeftSidebar,
		toggleRightSidebar,
		toggleBottomSidebar,
		toggleBottomTabWithPanel,
	} = useVSCodeLayout();

	const toggleMenu = (menu: string) => {
		if (activeMenus.includes(menu)) {
			setActiveMenus(activeMenus.filter((m) => m !== menu));
		} else {
			setActiveMenus([...activeMenus, menu]);
		}
	};

	return (
		<header className="flex flex-col bg-[#333333] border-b border-[#252525] text-sm">
			<div className="h-10 flex items-center px-4">
				<div className="flex items-center space-x-2">
					<div className="flex space-x-1 text-[#cccccc]">
						<button
							type="button"
							className={`px-2 py-1 hover:bg-[#505050] rounded cursor-pointer ${activeMenus.includes("File") ? "bg-[#505050]" : ""}`}
							onClick={() => toggleMenu("File")}
							onKeyDown={(e) => e.key === "Enter" && toggleMenu("File")}
						>
							File
						</button>
						<button
							type="button"
							className={`px-2 py-1 hover:bg-[#505050] rounded cursor-pointer ${activeMenus.includes("Edit") ? "bg-[#505050]" : ""}`}
							onClick={() => toggleMenu("Edit")}
							onKeyDown={(e) => e.key === "Enter" && toggleMenu("Edit")}
						>
							Edit
						</button>
						<button
							type="button"
							className={`px-2 py-1 hover:bg-[#505050] rounded cursor-pointer ${activeMenus.includes("View") ? "bg-[#505050]" : ""}`}
							onClick={() => toggleMenu("View")}
							onKeyDown={(e) => e.key === "Enter" && toggleMenu("View")}
						>
							View
						</button>
						<button
							type="button"
							className={`px-2 py-1 hover:bg-[#505050] rounded cursor-pointer ${activeMenus.includes("Help") ? "bg-[#505050]" : ""}`}
							onClick={() => toggleMenu("Help")}
							onKeyDown={(e) => e.key === "Enter" && toggleMenu("Help")}
						>
							Help
						</button>
					</div>
				</div>

				<div className="flex-1 flex justify-center">
					<div className="text-sm text-[#aaaaaa]">blog.joonhoe.com</div>
				</div>

				<div className="flex items-center space-x-1">
					<TooltipProvider>
						{/* Left Sidebar Toggle */}
						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									variant="ghost"
									size="sm"
									className="h-7 w-7 p-0 hover:bg-[#505050]"
									onClick={toggleLeftSidebar}
									aria-label="Toggle left sidebar"
								>
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
									className={`h-7 w-7 p-0 hover:bg-[#505050] ${showBottomSidebar && activeBottomTab === "comments" ? "text-[#007acc]" : ""}`}
									onClick={() => toggleBottomTabWithPanel("comments")}
									aria-label="Toggle comments panel"
								>
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
									className={`h-7 w-7 p-0 hover:bg-[#505050] ${showBottomSidebar && activeBottomTab === "terminal" ? "text-[#007acc]" : ""}`}
									onClick={() => toggleBottomTabWithPanel("terminal")}
									aria-label="Toggle terminal panel"
								>
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
									className={`h-7 w-7 p-0 hover:bg-[#505050] ${showBottomSidebar ? "text-[#007acc]" : ""}`}
									onClick={toggleBottomSidebar}
									aria-label="Toggle bottom panel"
								>
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
									className="h-7 w-7 p-0 hover:bg-[#505050]"
									onClick={toggleRightSidebar}
									aria-label="Toggle right sidebar"
								>
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
				className="flex items-center overflow-x-auto bg-[#252526]"
				role="tablist"
			>
				{BlogCategories.map((category) => {
					const isActive =
						pathname === category.path ||
						(category.path !== "/" && pathname?.startsWith(category.path));

					return (
						<Link key={category.path} href={category.path} tabIndex={0}>
							<div
								className={`
									flex items-center h-9 px-3 border-r border-[#191919] 
									${isActive ? "bg-[#1e1e1e] text-white" : "bg-[#2d2d2d] text-[#969696] hover:text-white"}
									cursor-pointer transition-colors
								`}
								role="tab"
								aria-selected={isActive}
								tabIndex={-1}
							>
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
