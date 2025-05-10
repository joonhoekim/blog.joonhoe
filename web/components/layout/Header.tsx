"use client";

import React from 'react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  toggleLeftSidebar: () => void;
  toggleRightSidebar: () => void;
  toggleBottomSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({
  toggleLeftSidebar,
  toggleRightSidebar,
  toggleBottomSidebar
}) => {
  return (
    <header className="h-10 bg-[#333333] border-b border-[#252525] flex items-center px-4 text-sm">
      <div className="flex items-center space-x-2">
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-7 px-2 hover:bg-[#505050]"
          onClick={toggleLeftSidebar}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sidebar">
            <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
            <line x1="9" x2="9" y1="3" y2="21"/>
          </svg>
        </Button>
        
        <div className="flex space-x-1 text-[#cccccc]">
          <span className="px-2 py-1 hover:bg-[#505050] rounded cursor-pointer">File</span>
          <span className="px-2 py-1 hover:bg-[#505050] rounded cursor-pointer">Edit</span>
          <span className="px-2 py-1 hover:bg-[#505050] rounded cursor-pointer">View</span>
          <span className="px-2 py-1 hover:bg-[#505050] rounded cursor-pointer">Help</span>
        </div>
      </div>
      
      <div className="flex-1 flex justify-center">
        <div className="text-sm text-[#aaaaaa]">blog.joonhoe.com</div>
      </div>
      
      <div className="flex items-center space-x-2">
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-7 px-2 hover:bg-[#505050]"
          onClick={toggleBottomSidebar}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-terminal">
            <polyline points="4 17 10 11 4 5"/>
            <line x1="12" x2="20" y1="19" y2="19"/>
          </svg>
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-7 px-2 hover:bg-[#505050]"
          onClick={toggleRightSidebar}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sidebar-close">
            <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
            <path d="M15 3v18"/>
          </svg>
        </Button>
      </div>
    </header>
  );
};

export default Header; 