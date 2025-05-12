"use client";

import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const RightSidebar = () => {
	const [aiPrompt, setAiPrompt] = React.useState("");
	const [aiResponses, setAiResponses] = React.useState<
		Array<{ role: "user" | "ai"; content: string }>
	>([{ role: "ai", content: "안녕하세요! 어떤 도움이 필요하신가요?" }]);

	const handleSendPrompt = () => {
		if (!aiPrompt.trim()) return;

		// 사용자 메시지 추가
		setAiResponses((prev) => [...prev, { role: "user", content: aiPrompt }]);

		// 실제 AI 통합이 있다면 여기서 API 호출을 수행
		// 지금은 간단한 에코 응답으로 시뮬레이션
		setTimeout(() => {
			setAiResponses((prev) => [
				...prev,
				{
					role: "ai",
					content: `AI 응답: ${aiPrompt}`,
				},
			]);
		}, 500);

		setAiPrompt("");
	};

	return (
		<div className="flex flex-col h-full bg-muted/80 border-l border-border">
			<Tabs defaultValue="ai" className="flex flex-col h-full">
				<TabsList className="flex justify-start h-9 bg-muted/80 border-b border-border pl-1">
					<TabsTrigger
						value="ai"
						className="h-9 px-2 data-[state=active]:bg-muted/80 data-[state=inactive]:bg-muted/50 data-[state=active]:border-t-2 data-[state=active]:border-t-primary"
					>
						AI 어시스턴트
					</TabsTrigger>

					<TabsTrigger
						value="outline"
						className="h-9 px-2 data-[state=active]:bg-muted/80 data-[state=inactive]:bg-muted/50 data-[state=active]:border-t-2 data-[state=active]:border-t-primary"
					>
						문서 구조
					</TabsTrigger>
				</TabsList>

				<TabsContent value="ai" className="flex flex-col flex-1 p-0 m-0">
					<div className="p-3 text-sm font-medium border-b border-border">
						AI 어시스턴트
					</div>

					{/* 대화 표시 영역 */}
					<div className="flex-1 overflow-y-auto p-3 space-y-4">
						{aiResponses.map((msg, index) => (
							<div
								key={index}
								className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
							>
								<div
									className={`max-w-[80%] p-2 rounded ${
										msg.role === "user"
											? "bg-primary text-primary-foreground"
											: "bg-muted text-muted-foreground"
									}`}
								>
									{msg.content}
								</div>
							</div>
						))}
					</div>

					{/* 입력 영역 */}
					<div className="p-3 border-t border-border">
						<div className="flex space-x-2">
							<Textarea
								placeholder="AI에게 질문하기..."
								className="min-h-[60px] bg-input text-foreground border border-input resize-none"
								value={aiPrompt}
								onChange={(e) => setAiPrompt(e.target.value)}
								onKeyDown={(e) => {
									if (e.key === "Enter" && !e.shiftKey) {
										e.preventDefault();
										handleSendPrompt();
									}
								}}
							/>
							<Button
								onClick={handleSendPrompt}
								className="bg-primary hover:bg-primary/80 text-primary-foreground"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="18"
									height="18"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
									className="lucide lucide-send"
								>
									<path d="m22 2-7 20-4-9-9-4Z" />
									<path d="M22 2 11 13" />
								</svg>
							</Button>
						</div>
					</div>
				</TabsContent>

				<TabsContent value="outline" className="flex-1 overflow-y-auto p-0 m-0">
					<div className="p-3 text-sm font-medium border-b border-border">
						OUTLINE
					</div>
					<div className="p-3">
						<div className="text-sm space-y-2">
							<div className="flex items-center space-x-2 hover:bg-accent/50 py-1 px-2 rounded">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="14"
									height="14"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
									className="lucide lucide-heading-1"
								>
									<path d="M4 12h8" />
									<path d="M4 18V6" />
									<path d="M12 18V6" />
									<path d="m17 12 3-2v8" />
								</svg>
								<span>소개</span>
							</div>
							<div className="flex items-center space-x-2 hover:bg-accent/50 py-1 px-2 rounded">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="14"
									height="14"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
									className="lucide lucide-heading-2"
								>
									<path d="M4 12h8" />
									<path d="M4 18V6" />
									<path d="M12 18V6" />
									<path d="M21 18h-4c0-4 4-3 4-6 0-1.5-2-2.5-4-1" />
								</svg>
								<span>주요 내용</span>
							</div>
							<div className="flex items-center space-x-2 hover:bg-accent/50 py-1 px-2 rounded ml-4">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="14"
									height="14"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
									className="lucide lucide-heading-3"
								>
									<path d="M4 12h8" />
									<path d="M4 18V6" />
									<path d="M12 18V6" />
									<path d="M17.5 10.5c1.7-1 3.5 0 3.5 1.5a2 2 0 0 1-2 2" />
									<path d="M17 17.5c2 1.5 4 .3 4-1.5a2 2 0 0 0-2-2" />
								</svg>
								<span>세부 항목 1</span>
							</div>
							<div className="flex items-center space-x-2 hover:bg-accent/50 py-1 px-2 rounded ml-4">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="14"
									height="14"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
									className="lucide lucide-heading-3"
								>
									<path d="M4 12h8" />
									<path d="M4 18V6" />
									<path d="M12 18V6" />
									<path d="M17.5 10.5c1.7-1 3.5 0 3.5 1.5a2 2 0 0 1-2 2" />
									<path d="M17 17.5c2 1.5 4 .3 4-1.5a2 2 0 0 0-2-2" />
								</svg>
								<span>세부 항목 2</span>
							</div>
							<div className="flex items-center space-x-2 hover:bg-accent/50 py-1 px-2 rounded">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="14"
									height="14"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
									className="lucide lucide-heading-2"
								>
									<path d="M4 12h8" />
									<path d="M4 18V6" />
									<path d="M12 18V6" />
									<path d="M21 18h-4c0-4 4-3 4-6 0-1.5-2-2.5-4-1" />
								</svg>
								<span>결론</span>
							</div>
						</div>
					</div>
				</TabsContent>
			</Tabs>
		</div>
	);
};

export default RightSidebar;
