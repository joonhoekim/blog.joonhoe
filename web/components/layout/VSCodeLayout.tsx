"use client";

import type { ReactNode } from "react";
import Header from "./Header";
import LeftSidebar from "./LeftSidebar";
import RightSidebar from "./RightSidebar";
import BottomSidebar from "./BottomSidebar";
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "@/components/ui/resizable";
import { VSCodeLayoutProvider, useVSCodeLayout } from "./VSCodeLayoutContext";

interface VSCodeLayoutProps {
	children: ReactNode;
}

const VSCodeLayoutContent = ({ children }: VSCodeLayoutProps) => {
	const {
		showLeftSidebar,
		showRightSidebar,
		showBottomSidebar,
		activeBottomTab,
	} = useVSCodeLayout();

	return (
		<div className="flex flex-col h-screen w-screen overflow-hidden bg-background text-foreground">
			<Header />

			<div className="flex-1 overflow-hidden">
				<ResizablePanelGroup direction="horizontal" className="h-full">
					{showLeftSidebar && (
						<>
							<ResizablePanel
								defaultSize={20}
								minSize={15}
								maxSize={30}
								className="bg-muted/80"
							>
								<LeftSidebar />
							</ResizablePanel>
							<ResizableHandle withHandle className="bg-background w-1" />
						</>
					)}

					<ResizablePanel
						defaultSize={showLeftSidebar && showRightSidebar ? 60 : 80}
					>
						<ResizablePanelGroup direction="vertical" className="h-full">
							<ResizablePanel
								defaultSize={showBottomSidebar ? 70 : 100}
								className="bg-background"
							>
								<main className="h-full overflow-auto">{children}</main>
							</ResizablePanel>

							{showBottomSidebar && (
								<>
									<ResizableHandle withHandle className="bg-background h-1" />
									<ResizablePanel
										defaultSize={30}
										minSize={10}
										maxSize={60}
										className="bg-background"
									>
										<BottomSidebar activeTab={activeBottomTab} />
									</ResizablePanel>
								</>
							)}
						</ResizablePanelGroup>
					</ResizablePanel>

					{showRightSidebar && (
						<>
							<ResizableHandle withHandle className="bg-background w-1" />
							<ResizablePanel
								defaultSize={20}
								minSize={15}
								maxSize={40}
								className="bg-muted/80"
							>
								<RightSidebar />
							</ResizablePanel>
						</>
					)}
				</ResizablePanelGroup>
			</div>
		</div>
	);
};

const VSCodeLayout = ({ children }: VSCodeLayoutProps) => {
	return (
		<VSCodeLayoutProvider>
			<VSCodeLayoutContent>{children}</VSCodeLayoutContent>
		</VSCodeLayoutProvider>
	);
};

export default VSCodeLayout;
