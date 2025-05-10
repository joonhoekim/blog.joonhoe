"use client";

import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

const BottomSidebar = () => {
  return (
    <div className="w-full h-full bg-[#1e1e1e] border-t border-[#333333]">
      <Tabs defaultValue="terminal" className="h-full">
        <TabsList className="flex justify-start h-9 bg-[#252526] border-b border-[#1e1e1e] pl-1">
          <TabsTrigger 
            value="terminal" 
            className="h-9 px-3 data-[state=active]:bg-[#1e1e1e] data-[state=inactive]:bg-[#2d2d2d] data-[state=active]:border-t-2 data-[state=active]:border-t-[#007acc]"
          >
            터미널
          </TabsTrigger>
          
          <TabsTrigger 
            value="problems" 
            className="h-9 px-3 data-[state=active]:bg-[#1e1e1e] data-[state=inactive]:bg-[#2d2d2d] data-[state=active]:border-t-2 data-[state=active]:border-t-[#007acc]"
          >
            문제
          </TabsTrigger>
          
          <TabsTrigger 
            value="output" 
            className="h-9 px-3 data-[state=active]:bg-[#1e1e1e] data-[state=inactive]:bg-[#2d2d2d] data-[state=active]:border-t-2 data-[state=active]:border-t-[#007acc]"
          >
            출력
          </TabsTrigger>
          
          <TabsTrigger 
            value="debug" 
            className="h-9 px-3 data-[state=active]:bg-[#1e1e1e] data-[state=inactive]:bg-[#2d2d2d] data-[state=active]:border-t-2 data-[state=active]:border-t-[#007acc]"
          >
            디버그 콘솔
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="terminal" className="h-[calc(100%-36px)] p-0 m-0">
          <div className="bg-[#1e1e1e] text-[#cccccc] p-2 font-mono text-sm h-full overflow-auto">
            <div className="flex">
              <span className="text-[#569cd6]">user@blog</span>
              <span className="text-[#cccccc]">:</span>
              <span className="text-[#ce9178]">~/git/blog.joonhoe-1</span>
              <span className="text-[#cccccc]">$</span>
              <span className="text-[#cccccc] ml-1">npm run dev</span>
            </div>
            <div className="text-[#6a9955]">{'>'} blog.joonhoe@0.1.0 dev</div>
            <div className="text-[#cccccc]">{'>'} next dev</div>
            <div className="text-[#569cd6]">- ready started server on [::]:3000, url: http://localhost:3000</div>
            <div className="text-[#569cd6]">- event compiled client and server successfully in 324 ms (17 modules)</div>
            <div className="text-[#569cd6]">- wait compiling...</div>
            <div className="text-[#569cd6]">- event compiled client and server successfully in 153 ms (19 modules)</div>
          </div>
        </TabsContent>
        
        <TabsContent value="problems" className="h-[calc(100%-36px)] p-0 m-0">
          <div className="p-4 text-sm text-[#cccccc]">
            <div className="text-center">문제가 발견되지 않았습니다</div>
          </div>
        </TabsContent>
        
        <TabsContent value="output" className="h-[calc(100%-36px)] p-0 m-0">
          <div className="p-4 text-sm text-[#cccccc]">
            <div>{'>'} Blog server start at http://localhost:3000</div>
          </div>
        </TabsContent>
        
        <TabsContent value="debug" className="h-[calc(100%-36px)] p-0 m-0">
          <div className="p-4 text-sm text-[#cccccc]">
            <div className="text-[#569cd6]">[info] 디버깅 세션이 시작되었습니다.</div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BottomSidebar; 