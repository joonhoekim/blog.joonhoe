"use client";

import { createContext, useState, useContext, type ReactNode } from "react";

interface VSCodeLayoutContextType {
  showLeftSidebar: boolean;
  showRightSidebar: boolean;
  showBottomSidebar: boolean;
  activeBottomTab: string;
  isEditMode: boolean;
  toggleLeftSidebar: () => void;
  toggleRightSidebar: () => void;
  toggleBottomSidebar: () => void;
  setActiveBottomTab: (tab: string) => void;
  toggleBottomTabWithPanel: (tab: string) => void;
  toggleEditMode: () => void;
}

const VSCodeLayoutContext = createContext<VSCodeLayoutContextType | undefined>(
  undefined,
);

export function VSCodeLayoutProvider({ children }: { children: ReactNode }) {
  const [showLeftSidebar, setShowLeftSidebar] = useState(true);
  const [showRightSidebar, setShowRightSidebar] = useState(true);
  const [showBottomSidebar, setShowBottomSidebar] = useState(false);
  const [activeBottomTab, setActiveBottomTab] = useState("comments");
  const [isEditMode, setIsEditMode] = useState(false);

  const toggleLeftSidebar = () => setShowLeftSidebar(!showLeftSidebar);
  const toggleRightSidebar = () => setShowRightSidebar(!showRightSidebar);
  const toggleBottomSidebar = () => setShowBottomSidebar(!showBottomSidebar);
  const toggleEditMode = () => setIsEditMode(!isEditMode);

  const toggleBottomTabWithPanel = (tab: string) => {
    if (activeBottomTab === tab && showBottomSidebar) {
      // If the active tab is already selected and sidebar is shown, toggle it off
      setShowBottomSidebar(false);
    } else {
      // Set the active tab and ensure bottom sidebar is shown
      setActiveBottomTab(tab);
      setShowBottomSidebar(true);
    }
  };

  return (
    <VSCodeLayoutContext.Provider
      value={{
        showLeftSidebar,
        showRightSidebar,
        showBottomSidebar,
        activeBottomTab,
        isEditMode,
        toggleLeftSidebar,
        toggleRightSidebar,
        toggleBottomSidebar,
        setActiveBottomTab,
        toggleBottomTabWithPanel,
        toggleEditMode,
      }}>
      {children}
    </VSCodeLayoutContext.Provider>
  );
}

export function useVSCodeLayout() {
  const context = useContext(VSCodeLayoutContext);
  if (context === undefined) {
    throw new Error(
      "useVSCodeLayout must be used within a VSCodeLayoutProvider",
    );
  }
  return context;
}
