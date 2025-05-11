"use client";

import { useParams } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { getPostById } from "@/data/posts";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Tag } from "lucide-react";

export default function PostPage() {
	const params = useParams();
	const postId = params.postId as string;
	const post = getPostById(postId);

	if (!post) {
		return (
			<div className="p-4 bg-[#1e1e1e] text-[#cccccc] h-full overflow-auto">
				<div className="max-w-4xl mx-auto">
					<div className="p-4 bg-[#252526] rounded border border-[#333333]">
						<h1 className="text-2xl font-semibold text-white mb-4">
							Post Not Found
						</h1>
						<p className="mb-4">The requested post could not be found.</p>
						<Button asChild variant="secondary" size="sm">
							<Link href="/">
								<ArrowLeft className="h-4 w-4 mr-2" /> Return to Home
							</Link>
						</Button>
					</div>
				</div>
			</div>
		);
	}

	// Format the category name for display
	const formattedCategory = post.category
		.split("-")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");

	return (
		<div className="p-4 bg-[#1e1e1e] text-[#cccccc] h-full overflow-auto">
			<div className="max-w-4xl mx-auto">
				<div className="mb-6">
					<Button
						asChild
						variant="ghost"
						size="sm"
						className="mb-4 hover:bg-[#333333]"
					>
						<Link href="/">
							<ArrowLeft className="h-4 w-4 mr-2" /> Back to Posts
						</Link>
					</Button>

					<h1 className="text-3xl font-semibold text-white mb-2">
						{post.title}
					</h1>

					<div className="flex items-center space-x-4 text-sm text-[#888888] mb-4">
						<div className="flex items-center">
							<Calendar className="h-4 w-4 mr-1" />
							<span>{post.date}</span>
						</div>
						<div className="flex items-center">
							<Tag className="h-4 w-4 mr-1" />
							<Link href={`/category/${post.category}`}>
								<span className="text-[#007acc] hover:underline">
									{formattedCategory}
								</span>
							</Link>
						</div>
					</div>

					<Separator className="bg-[#333333] mb-6" />

					<div className="bg-[#252526] p-5 rounded border border-[#333333]">
						<p className="text-[#dcdcdc] leading-relaxed mb-6">
							{post.content}
						</p>

						<div className="mt-8">
							<div className="flex flex-wrap gap-2">
								{post.tags.map((tag) => (
									<span
										key={tag}
										className="bg-[#333333] text-xs px-2 py-1 rounded"
									>
										{tag}
									</span>
								))}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
