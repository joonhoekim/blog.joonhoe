"use client";

import { useParams } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { getPostsByCategory } from "@/data/posts";
import Link from "next/link";

export default function CategoryPage() {
	const params = useParams();
	const categoryName = params.categoryName as string;

	// Format the category name for display
	const formattedCategoryName = categoryName
		.split("-")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");

	// Get posts for this category
	const posts = getPostsByCategory(categoryName);

	return (
		<div className="p-4 bg-[#1e1e1e] text-[#cccccc] h-full overflow-auto">
			<div className="max-w-4xl mx-auto">
				<h1 className="text-2xl font-semibold text-white mb-4">
					{formattedCategoryName}
				</h1>
				<Separator className="bg-[#333333] mb-6" />

				{posts.length === 0 ? (
					<div className="p-4 bg-[#252526] rounded border border-[#333333]">
						<p>No posts found in this category.</p>
					</div>
				) : (
					<div className="space-y-6">
						{posts.map((post) => (
							<Link href={`/${post.id}`} key={post.id}>
								<div className="p-4 bg-[#252526] rounded border border-[#333333] hover:border-[#505050] transition-colors cursor-pointer">
									<h2 className="text-xl text-white mb-2">{post.title}</h2>
									<p className="text-[#aaaaaa] mb-2">{post.excerpt}</p>
									<div className="flex justify-between items-center">
										<div className="flex space-x-2">
											{post.tags.slice(0, 3).map((tag) => (
												<span
													key={tag}
													className="bg-[#333333] text-xs px-2 py-1 rounded"
												>
													{tag}
												</span>
											))}
										</div>
										<span className="text-xs text-[#888888]">{post.date}</span>
									</div>
								</div>
							</Link>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
