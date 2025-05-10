"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function HomePage() {
	return (
		<div className="h-full flex flex-col">
			<div className="flex w-full h-9 bg-[#252526] border-b border-[#1e1e1e]">
				<Tabs defaultValue="home" className="w-full">
					<TabsList className="h-9 bg-[#252526] pl-1 flex">
						<TabsTrigger 
							value="home" 
							className="h-9 px-4 flex items-center space-x-2 data-[state=active]:bg-[#1e1e1e] data-[state=inactive]:bg-[#2d2d2d] data-[state=active]:border-t-2 data-[state=active]:border-t-[#007acc]"
						>
							<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file-text">
								<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/>
								<path d="M14 2v4a2 2 0 0 0 2 2h4"/>
								<path d="M10 9H8"/>
								<path d="M16 13H8"/>
								<path d="M16 17H8"/>
							</svg>
							<span>welcome.md</span>
						</TabsTrigger>
						
						<TabsTrigger 
							value="about" 
							className="h-9 px-4 flex items-center space-x-2 data-[state=active]:bg-[#1e1e1e] data-[state=inactive]:bg-[#2d2d2d] data-[state=active]:border-t-2 data-[state=active]:border-t-[#007acc]"
						>
							<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file-text">
								<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/>
								<path d="M14 2v4a2 2 0 0 0 2 2h4"/>
								<path d="M10 9H8"/>
								<path d="M16 13H8"/>
								<path d="M16 17H8"/>
							</svg>
							<span>about.md</span>
						</TabsTrigger>
					</TabsList>
					
					<TabsContent value="home" className="p-0 m-0 h-full">
						<div className="bg-[#1e1e1e] text-[#cccccc] p-6 h-full overflow-auto">
							<div className="max-w-3xl mx-auto">
								<h1 className="text-3xl font-bold mb-6 text-[#E06C75]"># Welcome to blog.joonhoe.com</h1>
								<p className="mb-4 text-[#dcdcdc] leading-relaxed">
									This blog features a VSCode-inspired UI, showcasing a clean developer experience with modern web technologies.
								</p>
								
								<h2 className="text-2xl font-bold mt-8 mb-4 text-[#61AFEF]">## Features</h2>
								<ul className="list-disc list-inside mb-6 space-y-2 text-[#dcdcdc]">
									<li>VSCode-inspired layout and design</li>
									<li>Integrated AI assistant in the right sidebar</li>
									<li>File explorer in the left sidebar</li>
									<li>Terminal and output panels in the bottom sidebar</li>
									<li>Syntax highlighting for code blocks</li>
								</ul>
								
								<h2 className="text-2xl font-bold mt-8 mb-4 text-[#61AFEF]">## Code Example</h2>
								<div className="bg-[#282c34] p-4 rounded mb-6 font-mono text-sm">
									<div><span className="text-[#c678dd]">import</span> <span className="text-[#e5c07b]">React</span> <span className="text-[#c678dd]">from</span> <span className="text-[#98c379]">'react'</span>;</div>
									<div className="mt-2"><span className="text-[#c678dd]">const</span> <span className="text-[#61afef]">Welcome</span> = () <span className="text-[#c678dd]">=&gt;</span> {`{`}</div>
									<div className="ml-4"><span className="text-[#c678dd]">return</span> (</div>
									<div className="ml-8"><span className="text-[#e06c75]">{`<div>`}</span><span className="text-[#dcdcdc]">Welcome to my blog!</span><span className="text-[#e06c75]">{`</div>`}</span></div>
									<div className="ml-4">);</div>
									<div>{`}`};</div>
									<div className="mt-2"><span className="text-[#c678dd]">export</span> <span className="text-[#c678dd]">default</span> <span className="text-[#e5c07b]">Welcome</span>;</div>
								</div>
								
								<h2 className="text-2xl font-bold mt-8 mb-4 text-[#61AFEF]">## Getting Started</h2>
								<p className="mb-4 text-[#dcdcdc] leading-relaxed">
									Explore the interface and use the various panels and sidebars to navigate the content.
									The AI assistant in the right panel can help answer your questions!
								</p>
							</div>
						</div>
					</TabsContent>
					
					<TabsContent value="about" className="p-0 m-0 h-full">
						<div className="bg-[#1e1e1e] text-[#cccccc] p-6 h-full overflow-auto">
							<div className="max-w-3xl mx-auto">
								<h1 className="text-3xl font-bold mb-6 text-[#E06C75]"># About blog.joonhoe.com</h1>
								<p className="mb-4 text-[#dcdcdc] leading-relaxed">
									This blog is a platform for sharing technology insights, coding tips, and personal thoughts
									with a developer-friendly interface inspired by Visual Studio Code.
								</p>
								
								<h2 className="text-2xl font-bold mt-8 mb-4 text-[#61AFEF]">## Technologies Used</h2>
								<ul className="list-disc list-inside mb-6 space-y-2 text-[#dcdcdc]">
									<li>Next.js</li>
									<li>React</li>
									<li>TypeScript</li>
									<li>Tailwind CSS</li>
									<li>Shadcn UI</li>
								</ul>
								
								<h2 className="text-2xl font-bold mt-8 mb-4 text-[#61AFEF]">## Contact</h2>
								<p className="mb-4 text-[#dcdcdc] leading-relaxed">
									Feel free to reach out with any questions or comments!
								</p>
							</div>
						</div>
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
}
