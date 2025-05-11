"use client";

import { Separator } from "@/components/ui/separator";
import { posts } from "@/data/posts";
import Link from "next/link";

export default function HomePage() {
	return (
		<div className="p-4 bg-[#1e1e1e] text-[#cccccc] h-full overflow-auto">
			<div className="max-w-4xl mx-auto">
				<div className="mb-8">
					<h1 className="text-2xl font-semibold text-white mb-4">All Posts</h1>
					<Separator className="bg-[#333333] mb-6" />

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
										<div className="flex items-center space-x-2">
											<span className="bg-[#007acc] text-xs px-2 py-1 rounded">
												{post.category
													.split("-")
													.map(
														(word) =>
															word.charAt(0).toUpperCase() + word.slice(1),
													)
													.join(" ")}
											</span>
											<span className="text-xs text-[#888888]">
												{post.date}
											</span>
										</div>
									</div>
								</div>
							</Link>
						))}
					</div>
				</div>

				<div className="mt-12">
					<h2 className="text-xl font-semibold text-white mb-4">
						Welcome to blog.joonhoe.com
					</h2>
					<Separator className="bg-[#333333] mb-6" />

					<div className="p-4 bg-[#252526] rounded border border-[#333333]">
						<p className="mb-4 text-[#dcdcdc]">
							This blog features a VSCode-inspired UI, showcasing a clean
							developer experience with modern web technologies.
						</p>

						<h3 className="text-lg font-medium text-white mt-6 mb-2">
							Technologies Used
						</h3>
						<ul className="list-disc list-inside mb-4 ml-2 space-y-1 text-[#dcdcdc]">
							<li>Next.js</li>
							<li>React</li>
							<li>TypeScript</li>
							<li>Tailwind CSS</li>
							<li>Shadcn UI</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
}
