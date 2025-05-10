"use client";

import React from 'react';
import Header from './Header';
import LeftSidebar from './LeftSidebar';
import RightSidebar from './RightSidebar';
import BottomSidebar from './BottomSidebar';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

interface VSCodeLayoutProps {
  children: React.ReactNode;
}

const VSCodeLayout: React.FC<VSCodeLayoutProps> = ({ children }) => {
  const [showLeftSidebar, setShowLeftSidebar] = React.useState(true);
  const [showRightSidebar, setShowRightSidebar] = React.useState(true);
  const [showBottomSidebar, setShowBottomSidebar] = React.useState(false);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#1e1e1e] text-[#cccccc]">
      <Header 
        toggleLeftSidebar={() => setShowLeftSidebar(!showLeftSidebar)}
        toggleRightSidebar={() => setShowRightSidebar(!showRightSidebar)}
        toggleBottomSidebar={() => setShowBottomSidebar(!showBottomSidebar)}
      />
      
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          {showLeftSidebar && (
            <>
              <ResizablePanel 
                defaultSize={20} 
                minSize={15}
                maxSize={30}
                className="bg-[#252526]"
              >
                <LeftSidebar />
              </ResizablePanel>
              <ResizableHandle withHandle className="bg-[#1e1e1e] w-1" />
            </>
          )}
          
          <ResizablePanel defaultSize={showLeftSidebar && showRightSidebar ? 60 : 80}>
            <ResizablePanelGroup direction="vertical" className="h-full">
              <ResizablePanel
                defaultSize={showBottomSidebar ? 70 : 100}
                className="bg-[#1e1e1e]"
              >
                <main className="h-full overflow-auto">
                  {children}
                </main>
              </ResizablePanel>
              
              {showBottomSidebar && (
                <>
                  <ResizableHandle withHandle className="bg-[#1e1e1e] h-1" />
                  <ResizablePanel
                    defaultSize={30}
                    minSize={10}
                    maxSize={60}
                    className="bg-[#1e1e1e]"
                  >
                    <BottomSidebar />
                  </ResizablePanel>
                </>
              )}
            </ResizablePanelGroup>
          </ResizablePanel>
          
          {showRightSidebar && (
            <>
              <ResizableHandle withHandle className="bg-[#1e1e1e] w-1" />
              <ResizablePanel 
                defaultSize={20} 
                minSize={15}
                maxSize={40}
                className="bg-[#252526]"
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

export default VSCodeLayout; 