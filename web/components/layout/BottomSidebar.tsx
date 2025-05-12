"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send, ThumbsUp, ThumbsDown } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useVSCodeLayout } from "./VSCodeLayoutContext";

interface Comment {
	id: number;
	author: string;
	avatarUrl?: string;
	initials: string;
	content: string;
	timestamp: string;
	likes: number;
	dislikes: number;
}

// Props interface for BottomSidebar
interface BottomSidebarProps {
	activeTab: string;
}

const mockComments: Comment[] = [
	{
		id: 1,
		author: "Joonhoe",
		initials: "JH",
		avatarUrl: "/avatars/joonhoe.png",
		content: "이 포스트에 대한 피드백 감사합니다. 내용이 정말 유익했어요!",
		timestamp: "2시간 전",
		likes: 5,
		dislikes: 0,
	},
	{
		id: 2,
		author: "Developer Kim",
		initials: "DK",
		content:
			"Next.js에 대한 내용이 잘 정리되어 있네요. 특히 서버 컴포넌트 부분이 명확하게 설명되어 있어 도움이 많이 됐습니다.",
		timestamp: "어제",
		likes: 3,
		dislikes: 1,
	},
	{
		id: 3,
		author: "Tech Enthusiast",
		initials: "TE",
		content:
			"TypeScript 타입에 관한 부분이 조금 더 자세히 설명되면 더 좋을 것 같아요.",
		timestamp: "3일 전",
		likes: 2,
		dislikes: 0,
	},
];

const BottomSidebar = ({ activeTab }: BottomSidebarProps) => {
	const [comments, setComments] = useState<Comment[]>(mockComments);
	const [newComment, setNewComment] = useState("");
	const { setActiveBottomTab } = useVSCodeLayout();

	const handleAddComment = () => {
		if (newComment.trim() === "") return;

		const comment: Comment = {
			id: Date.now(),
			author: "You",
			initials: "You",
			content: newComment,
			timestamp: "방금 전",
			likes: 0,
			dislikes: 0,
		};

		setComments([comment, ...comments]);
		setNewComment("");
	};

	const handleLike = (id: number) => {
		setComments(
			comments.map((comment) =>
				comment.id === id ? { ...comment, likes: comment.likes + 1 } : comment,
			),
		);
	};

	const handleDislike = (id: number) => {
		setComments(
			comments.map((comment) =>
				comment.id === id
					? { ...comment, dislikes: comment.dislikes + 1 }
					: comment,
			),
		);
	};

	const handleTabChange = (value: string) => {
		setActiveBottomTab(value);
	};

	return (
		<div className="w-full h-full bg-background border-t border-border">
			<Tabs
				defaultValue={activeTab}
				value={activeTab}
				className="h-full"
				onValueChange={handleTabChange}
			>
				<TabsList className="flex justify-start h-9 bg-muted/80 border-b border-border pl-1">
					<TabsTrigger
						value="comments"
						className="h-9 px-3 data-[state=active]:bg-background data-[state=inactive]:bg-muted/50 data-[state=active]:border-t-2 data-[state=active]:border-t-primary"
					>
						코멘트
					</TabsTrigger>

					<TabsTrigger
						value="terminal"
						className="h-9 px-3 data-[state=active]:bg-background data-[state=inactive]:bg-muted/50 data-[state=active]:border-t-2 data-[state=active]:border-t-primary"
					>
						터미널
					</TabsTrigger>

					<TabsTrigger
						value="problems"
						className="h-9 px-3 data-[state=active]:bg-background data-[state=inactive]:bg-muted/50 data-[state=active]:border-t-2 data-[state=active]:border-t-primary"
					>
						문제
					</TabsTrigger>

					<TabsTrigger
						value="output"
						className="h-9 px-3 data-[state=active]:bg-background data-[state=inactive]:bg-muted/50 data-[state=active]:border-t-2 data-[state=active]:border-t-primary"
					>
						출력
					</TabsTrigger>

					<TabsTrigger
						value="debug"
						className="h-9 px-3 data-[state=active]:bg-background data-[state=inactive]:bg-muted/50 data-[state=active]:border-t-2 data-[state=active]:border-t-primary"
					>
						디버그 콘솔
					</TabsTrigger>
				</TabsList>

				<TabsContent
					value="comments"
					className="h-[calc(100%-36px)] p-0 m-0 flex flex-col"
				>
					<div className="flex-1 overflow-auto p-4">
						<div className="space-y-4">
							{comments.map((comment) => (
								<div
									key={comment.id}
									className="bg-muted/80 p-3 rounded border border-border"
								>
									<div className="flex items-start space-x-2">
										<Avatar className="h-8 w-8">
											{comment.avatarUrl && (
												<AvatarImage
													src={comment.avatarUrl}
													alt={comment.author}
												/>
											)}
											<AvatarFallback className="bg-primary text-primary-foreground">
												{comment.initials}
											</AvatarFallback>
										</Avatar>
										<div className="flex-1">
											<div className="flex justify-between">
												<div className="font-medium text-foreground">
													{comment.author}
												</div>
												<div className="text-xs text-muted-foreground">
													{comment.timestamp}
												</div>
											</div>
											<p className="mt-1 text-sm text-foreground/80">
												{comment.content}
											</p>
											<div className="flex mt-2 space-x-2">
												<button
													type="button"
													onClick={() => handleLike(comment.id)}
													className="flex items-center text-xs text-muted-foreground hover:text-foreground"
												>
													<ThumbsUp className="h-3 w-3 mr-1" />
													{comment.likes}
												</button>
												<button
													type="button"
													onClick={() => handleDislike(comment.id)}
													className="flex items-center text-xs text-muted-foreground hover:text-foreground"
												>
													<ThumbsDown className="h-3 w-3 mr-1" />
													{comment.dislikes}
												</button>
											</div>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>

					<div className="p-3 border-t border-border bg-muted/80">
						<div className="flex items-end space-x-2">
							<Textarea
								value={newComment}
								onChange={(e) => setNewComment(e.target.value)}
								placeholder="코멘트를 입력하세요..."
								className="min-h-[40px] bg-input border-input text-foreground resize-none"
							/>
							<Button
								onClick={handleAddComment}
								size="sm"
								className="bg-primary hover:bg-primary/80 h-9 px-3"
							>
								<Send className="h-4 w-4" />
							</Button>
						</div>
					</div>
				</TabsContent>

				<TabsContent value="terminal" className="h-[calc(100%-36px)] p-0 m-0">
					<div className="bg-background text-foreground p-2 font-mono text-sm h-full overflow-auto">
						<div className="flex">
							<span className="text-blue-400 dark:text-blue-300">
								user@blog
							</span>
							<span className="text-foreground">:</span>
							<span className="text-orange-400 dark:text-orange-300">
								~/git/blog.joonhoe-1
							</span>
							<span className="text-foreground">$</span>
							<span className="text-foreground ml-1">npm run dev</span>
						</div>
						<div className="text-green-500 dark:text-green-400">
							{">"} blog.joonhoe@0.1.0 dev
						</div>
						<div className="text-foreground">{">"} next dev</div>
						<div className="text-blue-400 dark:text-blue-300">
							- ready started server on [::]:3000, url: http://localhost:3000
						</div>
						<div className="text-blue-400 dark:text-blue-300">
							- event compiled client and server successfully in 324 ms (17
							modules)
						</div>
						<div className="text-blue-400 dark:text-blue-300">
							- wait compiling...
						</div>
						<div className="text-blue-400 dark:text-blue-300">
							- event compiled client and server successfully in 153 ms (19
							modules)
						</div>
					</div>
				</TabsContent>

				<TabsContent value="problems" className="h-[calc(100%-36px)] p-4 m-0">
					<div className="text-muted-foreground text-sm">
						No problems have been detected in the workspace.
					</div>
				</TabsContent>

				<TabsContent value="output" className="h-[calc(100%-36px)] p-4 m-0">
					<div className="text-muted-foreground text-sm">
						No output to display.
					</div>
				</TabsContent>

				<TabsContent value="debug" className="h-[calc(100%-36px)] p-4 m-0">
					<div className="text-muted-foreground text-sm">
						No debug session active.
					</div>
				</TabsContent>
			</Tabs>
		</div>
	);
};

export default BottomSidebar;
